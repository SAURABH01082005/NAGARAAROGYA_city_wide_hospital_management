"""
FastAPI service exposing live ICU + Ward bed state for the BED ALLOCATION tab.

Run locally:
    pip install -r requirements.txt
    uvicorn api:app --reload --port 8001
"""

from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from hospital_state_phase1 import HospitalState


app = FastAPI(title="NagarAarogya Bed Allocation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IN-MEMORY HOSPITAL REGISTRY (seed data)
# ============================================================

HOSPITALS: dict[str, HospitalState] = {
    "H1": HospitalState("H1", "Hospital 1", total_icu_beds=8,  total_ward_beds=30, opd_daily_capacity=150),
    "H2": HospitalState("H2", "Hospital 2", total_icu_beds=6,  total_ward_beds=20, opd_daily_capacity=100),
    "H3": HospitalState("H3", "Hospital 3", total_icu_beds=10, total_ward_beds=40, opd_daily_capacity=200),
    "H4": HospitalState("H4", "Hospital 4", total_icu_beds=8,  total_ward_beds=25, opd_daily_capacity=120),
    "H5": HospitalState("H5", "Hospital 5", total_icu_beds=5,  total_ward_beds=22, opd_daily_capacity=110),
}

# Seed plausible occupancy so the UI shows variance
HOSPITALS["H1"].occupied_icu_beds, HOSPITALS["H1"].occupied_ward_beds = 6, 25
HOSPITALS["H2"].occupied_icu_beds, HOSPITALS["H2"].occupied_ward_beds = 6, 18
HOSPITALS["H3"].occupied_icu_beds, HOSPITALS["H3"].occupied_ward_beds = 7, 17
HOSPITALS["H4"].occupied_icu_beds, HOSPITALS["H4"].occupied_ward_beds = 8, 25
HOSPITALS["H5"].occupied_icu_beds, HOSPITALS["H5"].occupied_ward_beds = 4, 14


# ============================================================
# SCHEMAS
# ============================================================

class BedType(BaseModel):
    name: str
    available: int
    total: int


class HospitalView(BaseModel):
    id: str
    name: str
    availableBeds: int
    bedTypes: List[BedType]


def serialize(h: HospitalState) -> HospitalView:
    return HospitalView(
        id=h.hospital_id,
        name=h.hospital_name,
        availableBeds=h.icu_beds_available + h.ward_beds_available,
        bedTypes=[
            BedType(name="ICU",  available=h.icu_beds_available,  total=h.total_icu_beds),
            BedType(name="Ward", available=h.ward_beds_available, total=h.total_ward_beds),
        ],
    )


# ============================================================
# ROUTES
# ============================================================

@app.get("/")
def root():
    return {"service": "bed-allocation", "status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/hospitals", response_model=List[HospitalView])
def list_hospitals():
    return [serialize(h) for h in HOSPITALS.values()]


@app.get("/hospitals/{hospital_id}", response_model=HospitalView)
def get_hospital(hospital_id: str):
    h = HOSPITALS.get(hospital_id)
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return serialize(h)


@app.post("/hospitals/{hospital_id}/occupy/{bed_type}")
def occupy(hospital_id: str, bed_type: str):
    h = HOSPITALS.get(hospital_id)
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    bed_type = bed_type.lower()
    if bed_type == "icu":
        ok = h.occupy_icu_bed()
    elif bed_type == "ward":
        ok = h.occupy_ward_bed()
    else:
        raise HTTPException(status_code=400, detail="bed_type must be 'icu' or 'ward'")
    if not ok:
        raise HTTPException(status_code=409, detail=f"No {bed_type.upper()} beds available")
    return serialize(h)
