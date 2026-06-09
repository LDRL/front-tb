import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { FormInputText } from "@/components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import debounce from "just-debounce-it";
import { Client } from "../../models";
import { setSearchClient } from "@/redux/clientSlice";

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const debouncedSearch = useCallback(
        debounce((search: string) => {
            dispatch(setSearchClient(search));
        }, 300),
        []
    );

    const handleClick = () => {
        navigate("create");
    };

    const { control } = useForm<Client>({
        defaultValues: { id: 0, name: "", lastName: "", direccion: "", email: "", telefono: "", estado: 1, nit: "" },
    });

    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        debouncedSearch(event.target.value);
    };

    return (
        <div className="header">
            <div style={{ alignItems: "right" }}>
                <FormInputText
                    name="search"
                    control={control}
                    label="Buscar"
                    externalOnChange={handleSearchChange}
                />
            </div>

            <div>
                <Button variant="contained" color="primary" onClick={handleClick}>
                    Crear Cliente
                </Button>
            </div>
        </div>
    );
};

export default Header;
