"""
Flask backend that wraps the *2.py ML scripts and exposes their output
as JSON for the frontend. All logic is faithful to the original scripts:

  - bed_allocation2.py      -> /api/bed/* endpoints
  - department2.py          -> /api/department/run
  - opd_token_phase2.py     -> /api/opd/* endpoints
  - predict_and_append2.py  -> /api/predict/run
  - train_crit_dept2.py     -> /api/train/run
"""

import io
import os
import sys
import time
import uuid
import contextlib
from datetime import datetime, timedelta

import joblib
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(ROOT, "criticality_arrival_model.pkl")
ARRIVAL_CSV = os.path.join(ROOT, "hospital_data_analysis_arrival_only.csv")
DEPT_CSV = os.path.join(ROOT, "hospital_data_analysis_with_department.csv")

app = Flask(__name__, static_folder=ROOT, static_url_path="")
CORS(app)


# ============================================================
# MODEL LOAD (lazy + cached)
# ============================================================

_model = None

def get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


# ============================================================
# SHARED LOGIC (faithful to the *2.py scripts)
# ============================================================

def map_department(condition, procedure=""):
    c = str(condition).lower()
    p = str(procedure).lower()
    if "heart" in c or "cardiac" in c:
        return "Cardiology"
    if "stroke" in c or "brain" in c or "neuro" in c:
        return "Neurology"
    if "cancer" in c or "tumor" in c or "chemo" in p:
        return "Oncology"
    if "fractur" in c or "broken" in c or "ortho" in p:
        return "Orthopedics"
    if "diabet" in c or "thyroid" in c:
        return "Endocrinology"
    if "kidney" in c or "stone" in c or "urolog" in p:
        return "Urology"
    if "append" in c or "surgery" in p:
        return "General Surgery"
    if "asthma" in c or "respir" in c or "lung" in c:
        return "Pulmonology"
    if "allerg" in c:
        return "Emergency Medicine"
    if "pregnan" in c or "childbirth" in c or "c-section" in p:
        return "Obstetrics & Gynaecology"
    return "General Medicine"


def get_deterioration_risk(condition, procedure):
    text = (str(condition) + " " + str(procedure)).lower()
    if any(k in text for k in ["ventilator", "bypass", "open heart", "c-section", "stroke"]):
        return "high"
    if any(k in text for k in ["stent", "surgery", "ureteroscopy"]):
        return "medium"
    return "low"


CRITICALITY_WEIGHTS = {"Critical": 100, "High": 70, "Medium": 40, "Low": 10}
RISK_WEIGHTS = {"high": 30, "medium": 15, "low": 0}


def compute_bed_score(age, criticality, risk, waiting_minutes):
    score = 0
    score += CRITICALITY_WEIGHTS.get(criticality, 10)
    score += RISK_WEIGHTS.get(risk, 0)
    score += min(waiting_minutes / 5, 20)
    if age < 12 or age > 75:
        score += 5
    return round(score, 2)


def allocate_bed(score, icu_beds, ward_beds):
    ICU_ONLY_THRESHOLD = 120
    FLEX_THRESHOLD = 80
    if score >= ICU_ONLY_THRESHOLD:
        required = "ICU_ONLY"
    elif score >= FLEX_THRESHOLD:
        required = "FLEX"
    else:
        required = "WARD_ONLY"

    if required == "ICU_ONLY":
        if icu_beds > 0:
            return "ICU", "High-risk patient requires ICU", icu_beds - 1, ward_beds
        return None, "ICU required but no ICU beds available", icu_beds, ward_beds

    if required == "FLEX":
        if icu_beds > 0:
            return "ICU", "ICU preferred and available", icu_beds - 1, ward_beds
        if ward_beds > 0:
            return "Ward", "Ward acceptable due to ICU unavailability", icu_beds, ward_beds - 1
        return None, "No beds available", icu_beds, ward_beds

    if required == "WARD_ONLY":
        if ward_beds > 0:
            return "Ward", "ICU not required for this risk level", icu_beds, ward_beds - 1
        return None, "Ward required but no ward beds available", icu_beds, ward_beds

    return None, "Allocation error", icu_beds, ward_beds


# ============================================================
# BED ALLOCATION STATE (from bed_allocation2.py)
# ============================================================

bed_state = {"icu": 2, "ward": 3}


@app.route("/api/bed/state", methods=["GET"])
def bed_get_state():
    return jsonify(bed_state)


@app.route("/api/bed/reset", methods=["POST"])
def bed_reset():
    data = request.get_json(silent=True) or {}
    bed_state["icu"] = int(data.get("icu", 2))
    bed_state["ward"] = int(data.get("ward", 3))
    return jsonify({"ok": True, **bed_state})


@app.route("/api/bed/allocate", methods=["POST"])
def bed_allocate():
    data = request.get_json(force=True)
    age = int(data["age"])
    gender = data["gender"]
    condition = data["condition"]
    procedure = data.get("procedure", "")
    waiting_time = int(data.get("waiting_time", 0))

    log_lines = []
    log_lines.append("==== NEW PATIENT ARRIVAL ====")
    log_lines.append("")

    if bed_state["icu"] == 0 and bed_state["ward"] == 0:
        log_lines.append("ALL BEDS ARE FULL. NO FURTHER ALLOCATION POSSIBLE.")
        return jsonify({
            "output": "\n".join(log_lines),
            "beds_full": True,
            **bed_state
        })

    Xnew = pd.DataFrame([{
        "Age": age,
        "Gender": gender,
        "Condition": condition,
        "Procedure": procedure,
    }])

    criticality = get_model().predict(Xnew)[0]
    department = map_department(condition, procedure)
    risk = get_deterioration_risk(condition, procedure)
    score = compute_bed_score(age, criticality, risk, waiting_time)

    allocation, reason, bed_state["icu"], bed_state["ward"] = allocate_bed(
        score, bed_state["icu"], bed_state["ward"]
    )

    log_lines.append("==== TRIAGE & BED DECISION ====")
    log_lines.append("")
    log_lines.append(f"Predicted Criticality : {criticality}")
    log_lines.append(f"Assigned Department   : {department}")
    log_lines.append(f"Deterioration Risk    : {risk}")
    log_lines.append(f"Bed Score             : {score}")
    if allocation:
        log_lines.append(f"Allocated Bed         : {allocation}")
        log_lines.append(f"Reason                : {reason}")
    else:
        log_lines.append("No bed allocated")
        log_lines.append(f"Reason                : {reason}")
    log_lines.append("")
    log_lines.append("Remaining Beds:")
    log_lines.append(f"ICU  : {bed_state['icu']}")
    log_lines.append(f"Ward : {bed_state['ward']}")

    return jsonify({
        "output": "\n".join(log_lines),
        "criticality": str(criticality),
        "department": department,
        "risk": risk,
        "score": score,
        "allocation": allocation,
        "reason": reason,
        "icu": bed_state["icu"],
        "ward": bed_state["ward"],
        "beds_full": bed_state["icu"] == 0 and bed_state["ward"] == 0,
    })


# ============================================================
# DEPARTMENT (from department2.py)
# ============================================================

@app.route("/api/department/run", methods=["POST"])
def department_run():
    df = pd.read_csv(ARRIVAL_CSV)
    df["Department"] = df.apply(
        lambda row: map_department(
            row.get("Condition", ""),
            row.get("Procedure", "")
        ),
        axis=1,
    )
    df.to_csv(DEPT_CSV, index=False)

    counts = df["Department"].value_counts()

    lines = []
    lines.append("Department column successfully appended")
    lines.append(f"New file saved as: {os.path.basename(DEPT_CSV)}")
    lines.append("")
    lines.append("Department distribution:")
    for dept, cnt in counts.items():
        lines.append(f"{dept:<30} {cnt}")

    return jsonify({
        "output": "\n".join(lines),
        "rows": int(len(df)),
        "distribution": {k: int(v) for k, v in counts.items()},
        "output_file": os.path.basename(DEPT_CSV),
    })


# ============================================================
# PREDICT + APPEND (from predict_and_append2.py)
# ============================================================

@app.route("/api/predict/run", methods=["POST"])
def predict_run():
    data = request.get_json(force=True)
    age = int(data["age"])
    gender = data["gender"]
    condition = data["condition"]
    procedure = data.get("procedure", "")

    if not os.path.exists(DEPT_CSV):
        # generate it if missing
        df0 = pd.read_csv(ARRIVAL_CSV)
        df0["Department"] = df0.apply(
            lambda r: map_department(r.get("Condition", ""), r.get("Procedure", "")),
            axis=1,
        )
        df0.to_csv(DEPT_CSV, index=False)

    df = pd.read_csv(DEPT_CSV)

    new_input = {
        "Age": age,
        "Gender": gender,
        "Condition": condition,
        "Procedure": procedure,
    }
    new_input["Patient_ID"] = int(df["Patient_ID"].max()) + 1

    Xnew = pd.DataFrame([{
        "Age": age,
        "Gender": gender,
        "Condition": condition,
        "Procedure": procedure,
    }])

    criticality = get_model().predict(Xnew)[0]
    department = map_department(condition, procedure)

    new_input["Criticality"] = str(criticality)
    new_input["Department"] = department

    df = pd.concat([df, pd.DataFrame([new_input])], ignore_index=True)
    try:
        df.to_csv(DEPT_CSV, index=False)
        save_msg = f"Saved to: {os.path.basename(DEPT_CSV)}"
    except PermissionError:
        ts = int(time.time())
        fallback = os.path.join(ROOT, f"hospital_data_analysis_with_department_backup_{ts}.csv")
        df.to_csv(fallback, index=False)
        save_msg = f"CSV locked. Data saved to: {os.path.basename(fallback)}"

    lines = []
    lines.append("==== NEW PATIENT DATA SAVED ====")
    lines.append("")
    for k, v in new_input.items():
        lines.append(f"{k:<15}: {v}")
    lines.append("")
    lines.append(save_msg)

    return jsonify({
        "output": "\n".join(lines),
        "patient": new_input,
        "criticality": str(criticality),
        "department": department,
    })


# ============================================================
# TRAIN (from train_crit_dept2.py)
# ============================================================

@app.route("/api/train/run", methods=["POST"])
def train_run():
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import classification_report

    df = pd.read_csv(DEPT_CSV)
    df = df.dropna(subset=["Criticality"])

    X = df[["Age", "Gender", "Condition", "Procedure"]]
    y = df["Criticality"]

    preprocess = ColumnTransformer(transformers=[
        ("condition_text", TfidfVectorizer(max_features=1000), "Condition"),
        ("procedure_text", TfidfVectorizer(max_features=500), "Procedure"),
        ("gender", OneHotEncoder(handle_unknown="ignore"), ["Gender"]),
        ("age", "passthrough", ["Age"]),
    ])

    model = Pipeline([
        ("preprocess", preprocess),
        ("classifier", LogisticRegression(max_iter=3000)),
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred)

    joblib.dump(model, MODEL_PATH)
    global _model
    _model = model  # refresh cache

    lines = []
    lines.append("===== CRITICALITY CLASSIFICATION REPORT =====")
    lines.append("")
    lines.append(report)
    lines.append("Criticality arrival-time model trained successfully")
    lines.append(f"Model saved as: {os.path.basename(MODEL_PATH)}")

    return jsonify({"output": "\n".join(lines)})


# ============================================================
# OPD TOKEN (from opd_token_phase2.py)
# ============================================================

AVG_SERVICE_TIME_MIN = 13
SURGE_MULTIPLIER = 1.5
TOKEN_EXPIRY_MIN = 30
OPD_START_HOUR = 10
OPD_END_HOUR = 19
NEARBY_HOSPITALS = ["Hospital B (Low Load)", "Hospital C (Moderate Load)"]
SERVICE_RATE_PER_HOUR = int(60 / AVG_SERVICE_TIME_MIN)
MAX_TOKENS_PER_HOUR = int(SERVICE_RATE_PER_HOUR * SURGE_MULTIPLIER)

opd_state = {
    "issued_tokens": [],
    "active_queue": [],
    "hourly_issue_log": [],
}


def _opd_clean_hourly_log():
    cutoff = datetime.now() - timedelta(hours=1)
    log = opd_state["hourly_issue_log"]
    while log and log[0] < cutoff:
        log.pop(0)


def _opd_surge_level():
    _opd_clean_hourly_log()
    n = len(opd_state["hourly_issue_log"])
    if n > MAX_TOKENS_PER_HOUR * 1.2:
        return "CRITICAL"
    if n > MAX_TOKENS_PER_HOUR:
        return "HIGH"
    return "NORMAL"


def _opd_estimated_wait_time():
    base = len(opd_state["active_queue"]) * AVG_SERVICE_TIME_MIN
    level = _opd_surge_level()
    if level == "HIGH":
        return int(base * 1.5)
    if level == "CRITICAL":
        return int(base * 2.5)
    return base


def _opd_is_open():
    h = datetime.now().hour
    return OPD_START_HOUR <= h < OPD_END_HOUR


def _opd_status_payload(extra_lines=None):
    level = _opd_surge_level()
    lines = []
    lines.append("--- OPD STATUS ---")
    lines.append(f"Active Queue Length     : {len(opd_state['active_queue'])}")
    lines.append(f"Estimated Wait Time     : {_opd_estimated_wait_time()} minutes")
    lines.append(f"Surge Level             : {level}")
    if level in ("HIGH", "CRITICAL"):
        lines.append("")
        lines.append("HIGH OPD LOAD - consider nearby hospitals:")
        for h in NEARBY_HOSPITALS:
            lines.append(f"  - {h}")
    if extra_lines:
        lines.append("")
        lines.extend(extra_lines)
    return {
        "output": "\n".join(lines),
        "queue_length": len(opd_state["active_queue"]),
        "wait_minutes": _opd_estimated_wait_time(),
        "surge_level": level,
        "opd_open": _opd_is_open(),
        "avg_service_time_min": AVG_SERVICE_TIME_MIN,
        "service_rate_per_hour": SERVICE_RATE_PER_HOUR,
        "max_tokens_per_hour": MAX_TOKENS_PER_HOUR,
        "nearby_hospitals": NEARBY_HOSPITALS,
    }


@app.route("/api/opd/status", methods=["GET"])
def opd_status():
    return jsonify(_opd_status_payload())


@app.route("/api/opd/generate-token", methods=["POST"])
def opd_generate_token():
    _opd_clean_hourly_log()

    if len(opd_state["hourly_issue_log"]) >= MAX_TOKENS_PER_HOUR:
        lines = [
            "TOKEN GENERATION PAUSED",
            "OPD is under heavy load. Please try again later.",
        ]
        return jsonify(_opd_status_payload(lines) | {"ok": False, "reason": "RATE_LIMIT"})

    token_id = str(uuid.uuid4())[:8]
    token_number = len(opd_state["issued_tokens"]) + 1

    token = {
        "id": token_id,
        "number": token_number,
        "status": "PENDING",
        "issued_at": datetime.now().isoformat(),
        "activated_at": None,
    }

    opd_state["issued_tokens"].append(token)
    opd_state["hourly_issue_log"].append(datetime.now())

    lines = [
        "TOKEN GENERATED",
        f"Token Number : {token['number']}",
        f"QR Code ID   : {token['id']}",
        f"Est. Wait    : {_opd_estimated_wait_time()} minutes",
    ]
    payload = _opd_status_payload(lines)
    payload.update({"ok": True, "token": token})
    return jsonify(payload)


@app.route("/api/opd/activate-token", methods=["POST"])
def opd_activate_token():
    data = request.get_json(force=True)
    tid = data.get("token_id", "").strip()

    for tok in opd_state["issued_tokens"]:
        if tok["id"] == tid:
            if tok["status"] != "PENDING":
                lines = [f"ACTIVATION FAILED (INVALID_STATE)"]
                return jsonify(_opd_status_payload(lines) | {"ok": False, "reason": "INVALID_STATE"})

            issued_at = datetime.fromisoformat(tok["issued_at"])
            if datetime.now() - issued_at > timedelta(minutes=TOKEN_EXPIRY_MIN):
                tok["status"] = "EXPIRED"
                lines = [f"ACTIVATION FAILED (EXPIRED)"]
                return jsonify(_opd_status_payload(lines) | {"ok": False, "reason": "EXPIRED"})

            tok["status"] = "ACTIVE"
            tok["activated_at"] = datetime.now().isoformat()
            opd_state["active_queue"].append(tok)
            lines = ["TOKEN ACTIVATED - Added to OPD queue"]
            return jsonify(_opd_status_payload(lines) | {"ok": True, "token": tok})

    lines = ["ACTIVATION FAILED (NOT_FOUND)"]
    return jsonify(_opd_status_payload(lines) | {"ok": False, "reason": "NOT_FOUND"})


@app.route("/api/opd/serve-next", methods=["POST"])
def opd_serve_next():
    if not opd_state["active_queue"]:
        lines = ["No patients in active queue"]
        return jsonify(_opd_status_payload(lines) | {"ok": False})

    tok = opd_state["active_queue"].pop(0)
    tok["status"] = "SERVED"
    lines = [f"Serving token number {tok['number']}"]
    return jsonify(_opd_status_payload(lines) | {"ok": True, "served_number": tok["number"]})


@app.route("/api/opd/reset", methods=["POST"])
def opd_reset():
    opd_state["issued_tokens"].clear()
    opd_state["active_queue"].clear()
    opd_state["hourly_issue_log"].clear()
    return jsonify({"ok": True})


# ============================================================
# FRONTEND
# ============================================================

@app.route("/")
def index():
    return send_from_directory(ROOT, "frontend.html")


if __name__ == "__main__":
    print("=" * 60)
    print("Smart Hospital ML Backend")
    print("=" * 60)
    print(f"Model      : {MODEL_PATH}")
    print(f"Open       : http://127.0.0.1:5000/")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=False)
