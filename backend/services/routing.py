def route_ticket(location: str) -> str:
    location = location.lower()

    if "hostel" in location:
        return "HOSTEL_OFFICE"
    if "class" in location or "lab" in location:
        return "ACADEMIC_OFFICE"

    return "CAMPUS_FACILITIES"

