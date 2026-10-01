import React, {useEffect, useState } from 'react';
import { RootState } from '@/redux/store';
import {
  Box, Button, Tab, Tabs, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { AppIconButton, FormDropdown,  FormInputImage,  FormInputNumber,  FormInputText, FormTextArea, IosSwitch } from '@/components';
import { useForm } from 'react-hook-form';
import CardForm from '../../../../components/Cards/CardForm'
import LoadMask from '@/components/LoadMask/LoadMask';
import { useFetchMarcaOptions, useFetchOptions, useFetchUnitOptions } from '@/hooks/useOption';
import { fetchProduct } from '../../services/product';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateRoutes } from '@/models';
import { openModal, clearProduct } from '@/redux/productSlice';
import Loading from '@/components/Loading';
import "./ProductCreate.css"
import { toast } from 'react-toastify';
import { Detail } from '../../models/product.domain.type';
import { ProductForm } from '../../models/product.domain.type';
import { useCreateProduct, useProductDetails, useUpdateProduct } from '../../hooks/useProduct';
import { PresentationsTab, RowErrors } from '../PresentationsTab/PresentationsTab';
import { ProductPricesTab } from '../ProductPricesTab/ProductPricesTab';

const CreateProduct: React.FC = () => {

  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentProduct } = useSelector((state: RootState) => state.product);

  const { control, handleSubmit, reset, setValue, watch} = useForm<ProductForm>({
    defaultValues: { name: '', hasExpiration: false },
  });

  const hasExpiration = watch('hasExpiration');


  const {data: options, isLoading, isError} = useFetchOptions();
  const {data: marcaOptions, isLoading: isMarcaLoading, isError: isMarcaError} = useFetchMarcaOptions();

  const {data: unitOptions} =   useFetchUnitOptions();

  const { rows, addEmptyRow, updateRow, deleteRow, setRows, updateRowPrecios } = useProductDetails();

  const [rowErrors, setRowErrors] = useState<Record<string, RowErrors>>({});

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  
  useEffect(() => {
    if (!id) {
      dispatch(clearProduct());

      reset({
        name: '',
        //price: 0,
        description: '',
        idCategory: undefined,
        idBrand: undefined,
        idPresentation: undefined,
        hasExpiration: false,
      });

      setRows([]);
      setRowErrors({});
      setActiveTab(0);
      setSubtitulo("Nuevo");
      return;
    }

    const fetchProductData = async () => {
      try {
        const [err, responseData] = await fetchProduct(id);

        if (!err && responseData) {
          dispatch(openModal(responseData));
        }
      } catch (error: unknown) {
        console.log(error);
      }
    };

    fetchProductData();
  }, [id, dispatch, reset, setRows, setRowErrors, setActiveTab]);

  useEffect(() => {
    if (currentProduct && id) {
      reset(currentProduct);
      setSubtitulo("Editar");
      setRows(
        (currentProduct.presentacions || []).map((p: Detail) => ({ ...p, id: crypto.randomUUID() }))
      );
    }
  }, [currentProduct, id, reset, setRows]);

  const onSubmit = async (data: ProductForm) => {
    setRowErrors({});

    if (rows.length === 0) {
      toast.error("Debe agregar al menos una presentación");
      setActiveTab(1);
      return;
    }

    const nextErrors: Record<string, RowErrors> = {};
    const seenPresentations = new Set<number>();

    rows.forEach((row) => {
      const err: RowErrors = {};

      if (!row.idPresentation) {
        err.idPresentation = true;
      } else if (seenPresentations.has(row.idPresentation)) {
        err.idPresentation = true;
      } else {
        seenPresentations.add(row.idPresentation);
      }

      if (!row.price || row.price <= 0) {
        err.price = true;
      }

      if (!row.baseQuantity || row.baseQuantity <= 0) {
        err.baseQuantity = true;
      }

      if (Object.keys(err).length > 0) {
        nextErrors[row.id!] = err;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setRowErrors(nextErrors);
      setActiveTab(1);

      const duplicated = Object.values(nextErrors).some(e => e.idPresentation);
      toast.error(
        duplicated
          ? "Revisá las presentaciones: no pueden estar vacías ni repetidas"
          : "Completá precio y cantidad base de todas las presentaciones"
      );
      return;
    }

    const presentacions = rows.map((row) => {
      const validPrecios = (row.precios ?? []).filter(p => p.idtipoCli > 0 && p.precio > 0);

      return { ...row, precios: validPrecios.length > 0 ? validPrecios : undefined };
    });

    const newProduct = {
      ...data,
      idPresentation: presentacions[0].idPresentation,
      presentacions
    }

    setLoading(true);  
    try {
      if (currentProduct) {
        await updateProductMutation.mutateAsync({
        productCode: currentProduct.productCode,
        data: newProduct,
      });

        toast.success("Producto actualizado exitosamente");
      } else {
        await createProductMutation.mutateAsync (newProduct);
        toast.success("Producto creado exitosamente");
      }

      navigate(`/private/${PrivateRoutes.PRODUCT}`, { replace: true });
    } catch (error: any) {
      toast.error(error?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading){
    return <p>Cargando opciones ....</p>
  }
  if(isError){
    return <p>Error al cargar las opciones, {isError}</p>
  }

  if (isMarcaLoading){
    return <p>Cargando opciones ....</p>
  }
  if(isMarcaError){
    return <p>Error al cargar las opciones</p>
  }

  return (    
    <div >
      {loading && (
        <Loading loading/>
      )}

      <CardForm
        titulo='Producto'
        subtitulo={subtitulo}
        leadingAction={
          <Tooltip title="Volver al listado">
            <AppIconButton
              color="primary"
              onClick={() => navigate(`/private/${PrivateRoutes.PRODUCT}`)}
            >
              <ArrowBackIcon />
            </AppIconButton>
          </Tooltip>
        }
      >
        <LoadMask
        />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Tabs
            value={activeTab}
            onChange={(_e, value: number) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            sx={{ mb: 2 }}
          >
            <Tab label="Información general" />
            <Tab label="Presentaciones" />
            <Tab label="Precios" />
          </Tabs>

          {/* ── Tab: Información general ── */}
          {activeTab === 0 && (
            <div>
              <div className="container_image">
                {/* Columna izquierda */}
                <div className="left">
                  <div className="section">
                    <FormInputText
                      name="name"
                      control={control}
                      label="Nombre producto"
                      rules={{ required: 'Producto es un campo requerido' }}
                    />
                  </div>

                  <div className="row">
                    <FormDropdown
                      name="idCategory"
                      control={control}
                      label="Categoria"
                      rules={{ required: 'Categoria es un campo requerido' }}
                      options={options || []}
                    />

                    <FormDropdown
                      name="idUnit"
                      control={control}
                      label="Unidad de medida"
                      rules={{ required: 'Unidad de medida es un campo requerido' }}
                      options={unitOptions || []}
                    />

                    <FormDropdown
                      name="idBrand"
                      control={control}
                      label="Marca"
                      rules={{ required: 'Marca es un campo requerido' }}
                      options={marcaOptions || []}
                    />

                    <FormInputNumber
                      name="stockMinimum"
                      label="Stock Minimo"
                      control={control}
                      rules={{ required: 'stock minimo es un campo requerido' }}
                    />


                    
                  </div>
                </div>

                {/* Imagen a la derecha */}
                <div className="image">
                  <FormInputImage
                    name="image"
                    label="imagen del producto"
                    control={control}
                  />
                </div>
              </div>

                <div className="container_selector"></div>

                <div className='section' >
                      <IosSwitch
                        name="hasExpiration"
                        size="small"
                        checked={!!hasExpiration}
                        onChange={(value) => setValue('hasExpiration', value)}
                        color="var(--color-primary)"
                        label="Controla vencimiento (requiere fecha de vencimiento en cada compra)"
                      />
                </div>
              

              <div className="container_selector"></div>

              {/*Descripcion */}

              <div className='section'>
                <FormTextArea
                  name="description"
                  control={control}
                  label="Descripción"
                  rules={{required: 'Descripción es un campo requerido',
                    maxLength: {
                      value: 500,
                      message: "Máximo 500 caracteres",
                    },
                  }}
                  rows={2}
                  placeholder="Escribe algo aquí..."
                />
              </div>
            </div>
          )}

          {/* ── Tab: Presentaciones ── */}
          {activeTab === 1 && (
            <PresentationsTab
              rows={rows}
              rowErrors={rowErrors}
              addEmptyRow={addEmptyRow}
              updateRow={updateRow}
              deleteRow={deleteRow}
            />
          )}

          {/* ── Tab: Precios ── */}
          {activeTab === 2 && (
            <ProductPricesTab
              rows={rows}
              updateRowPrecios={updateRowPrecios}
            />
          )}

          {/**Botones */}

          <div className='container_button'>
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              type="button"
              sx={{ mt: 2 }}
              color='error'
              onClick={() => navigate('/private/product')}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </CardForm>
    </div>  
  );
};

export default CreateProduct;
