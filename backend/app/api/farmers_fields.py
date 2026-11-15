
import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


router = APIRouter(tags=["Farmers and Fields"])

DB_PATH = Path(__file__).resolve().parents[2] / "agrovision.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db():
    connection = get_connection()

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS farmers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT DEFAULT '',
                location TEXT DEFAULT ''
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                area_hectares REAL NOT NULL,
                crop TEXT NOT NULL,
                farmer_id INTEGER,
                FOREIGN KEY (farmer_id)
                    REFERENCES farmers(id)
                    ON DELETE SET NULL
            )
        """)

        connection.commit()
    finally:
        connection.close()


init_db()


class FarmerCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    phone: str = Field(default="", max_length=30)
    location: str = Field(default="", max_length=200)


class FieldCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    location: str = Field(min_length=1, max_length=200)
    area_hectares: float = Field(gt=0)
    crop: str = Field(min_length=1, max_length=100)
    farmer_id: int | None = None


@router.get("/api/farmers")
def get_farmers():
    connection = get_connection()

    try:
        rows = connection.execute(
            "SELECT * FROM farmers ORDER BY id DESC"
        ).fetchall()

        return {
            "farmers": [dict(row) for row in rows]
        }
    finally:
        connection.close()


@router.post("/api/farmers")
def create_farmer(data: FarmerCreate):
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO farmers (name, phone, location)
            VALUES (?, ?, ?)
            """,
            (data.name, data.phone, data.location)
        )

        connection.commit()

        return {
            "message": "Farmer created successfully",
            "id": cursor.lastrowid,
            "name": data.name
        }
    finally:
        connection.close()


@router.delete("/api/farmers/{farmer_id}")
def delete_farmer(farmer_id: int):
    connection = get_connection()

    try:
        cursor = connection.execute(
            "DELETE FROM farmers WHERE id = ?",
            (farmer_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Farmer not found"
            )

        return {"message": "Farmer deleted successfully"}
    finally:
        connection.close()


@router.get("/api/fields")
def get_fields():
    connection = get_connection()

    try:
        rows = connection.execute("""
            SELECT
                fields.*,
                farmers.name AS farmer_name
            FROM fields
            LEFT JOIN farmers
                ON fields.farmer_id = farmers.id
            ORDER BY fields.id DESC
        """).fetchall()

        return {
            "fields": [dict(row) for row in rows]
        }
    finally:
        connection.close()


@router.post("/api/fields")
def create_field(data: FieldCreate):
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO fields (
                name,
                location,
                area_hectares,
                crop,
                farmer_id
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data.name,
                data.location,
                data.area_hectares,
                data.crop,
                data.farmer_id
            )
        )

        connection.commit()

        return {
            "message": "Field created successfully",
            "id": cursor.lastrowid
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="Selected farmer does not exist"
        )
    finally:
        connection.close()


@router.delete("/api/fields/{field_id}")
def delete_field(field_id: int):
    connection = get_connection()

    try:
        cursor = connection.execute(
            "DELETE FROM fields WHERE id = ?",
            (field_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Field not found"
            )

        return {"message": "Field deleted successfully"}
    finally:
        connection.close()
