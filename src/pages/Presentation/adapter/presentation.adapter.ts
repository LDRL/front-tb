import { ApiPresentation, Presentation} from "../models";

export const PresentationAdapter = (presentation: ApiPresentation): Presentation => {
    return{
        id: presentation._id,
        name: presentation.nombre,
    }
}

export function PresentationListAdapter(apiPresentationList: ApiPresentation[]): Presentation[] {
    return apiPresentationList.map(PresentationAdapter);
}
