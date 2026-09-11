import { ApiUnit, Unit } from "../models";

export const UnitAdapter = (unit: ApiUnit): Unit => {
    return {
        id: unit._id,
        name: unit.nombre,
        abbreviation: unit.abreviatura,
        status: unit.estado,
    }
}

export function UnitListAdapter(apiUnitList: ApiUnit[]): Unit[] {
    return apiUnitList.map(UnitAdapter);
}