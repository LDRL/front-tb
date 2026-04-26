// CREATE
import axiosClient from "@/utils/axiosClient";
import axios from "axios";
import { ApiCreateSupplier } from "../models/supplier.api.type";

export const fetchSupplierCreate = async (url: string,  payload: ApiCreateSupplier ): Promise<[Error?, any?, any?]> => {
  try {
    const response = await axiosClient.post(url, payload);

    const { data } = response.data;
    return [undefined, data, response];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return [error, undefined, undefined];
    }
    return [new Error("Error de red"), undefined, undefined];
  }
};


////////UPDATE
export const fetchSupplierUpdate = async (url: string,  payload: ApiCreateSupplier):  Promise<[Error?, any?, any?]> => {
    try {
        const response = await axiosClient.put(url, payload);
        const { data } = response.data;
        return [undefined, data, response];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
        return [error, undefined, undefined];
        }
        return [new Error("Error de red"), undefined, undefined];
    }
};