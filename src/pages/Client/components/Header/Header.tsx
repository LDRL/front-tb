import React, { useCallback, useEffect } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FormInputText } from "@/components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import debounce from "just-debounce-it";
import { setSearchClient } from "@/redux/clientSlice";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/modules/auth/helper/permissions";

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const search = useSelector((state: any) => state.client.search);
    const { can } = usePermission();
    const canCreate = can(PERMISSIONS.CLIENTS.CREATE);

    const debouncedSearch = useCallback(
        debounce((search: string) => {
            dispatch(setSearchClient(search));
        }, 300),
        []
    );

    const handleClick = () => {
        navigate("create");
    };

    const { control, reset } = useForm({
        defaultValues: { search },
    });

    useEffect(() => {
        reset({ search });
    }, [search, reset]);

    const handleSearchChange = (value: string) => {
        debouncedSearch(value);
    };

    return (
        <div className="header_page">
            <div style={{ alignItems: "right" }}>
                <FormInputText
                    name="search"
                    control={control}
                    label="Buscar"
                    externalOnChange={handleSearchChange}
                />
            </div>

            {canCreate && (
                <div>
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Crear Cliente
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Header;
