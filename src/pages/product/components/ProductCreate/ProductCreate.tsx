import React, {useEffect, useState } from 'react';
import { RootState } from '@/redux/store';
import { Box, Button, Checkbox, FormControlLabel} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FormDropdown,  FormInputImage,  FormInputNumber,  FormInputText, FormTextArea } from '@/components';
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
import { DetailCreate } from '../ProductDetail/ProductDetail';

const CreateProduct: React.FC = () => {

  const [loading , setLoading] = useState<boolean>(false);
  const [subtitulo, setSubtitulo] = useState<string>("");
  const navigate = useNavigate();

  const {id} = useParams<{id: string}>(); //Se captura el id de un producto
  const dispatch = useDispatch();
  const { currentProduct } = useSelector((state: RootState) => state.product);

  const { control, handleSubmit, reset, getValues, setValue, watch} = useForm<ProductForm>({
    defaultValues: { name: '', hasExpiration: false },
  });

  const hasExpiration = watch('hasExpiration');


  const {data: options, isLoading, isError} = useFetchOptions();
  const {data: marcaOptions, isLoading: isMarcaLoading, isError: isMarcaError} = useFetchMarcaOptions();

  const {data: unitOptions} =   useFetchUnitOptions();

  const { rows, addRow, deleteRow, editRow, editingId, setEditingId, setRows } = useProductDetails();

  const [errors, setErrors] = useState({
      idPresentation: false,
      price: false,
      barCode: false,
      baseQuantity: false,
      detailProduct: false
  });

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
      });

      setSubtitulo("Nuevo");
      return;
    }

    const fetchProductData = async () => {
      try {
        const [err, responseData] = await fetchProduct(id);

        if (!err && responseData) {
          dispatch(openModal(responseData));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductData();
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (currentProduct && id) {
      reset(currentProduct);
      setSubtitulo("Editar");
      setRows(
        (currentProduct.presentacions || []).map((p: Detail) => ({ ...p, id: crypto.randomUUID() }))
      );
    }
  }, [currentProduct, id, reset]);

  const onSubmit = async (data: ProductForm) => {
    setErrors({
      idPresentation: false,
      price: false,
      barCode: false,
      baseQuantity: false,
      detailProduct: false
    });

    if (rows.length === 0) {
      setErrors(prev => ({ ...prev, detailProduct: true }));
      return;
    }

    const newProduct = {
      ...data,
      presentacions: rows
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
      >
        <LoadMask
        />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div style={{border: '1px solid #ccc', borderRadius: '5px'}} >
            <div className='page-title-detail-box'>
              <h4>Información General </h4>
            </div>

            <div style={{padding: '15px'}}>

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


                    <div className='section' style={{borderRadius: 5,  border: '1px solid rgb(204, 204, 204)', paddingInline: '10px'}}>
                      <FormControlLabel
                        label="Permite vencimiento"
                        control={
                          <Checkbox
                            name='hasExpiration'
                            checked={!!hasExpiration}
                            onChange={(e) => setValue('hasExpiration', e.target.checked)}
                          />
                        }
                      />
                    </div>
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
            </div>
          </div>

          <div className="container_selector"></div>       

          {/*Detalle */}

          <div style={{border: '1px solid #ccc', borderRadius: '5px'}} >
            <div className='page-title-detail-box'>
              <h4>Presentación del producto</h4>              
            </div>
            <div style={{padding: '15px'}}>
              <DetailCreate
                control={control}
                getValues={getValues}
                setValue={setValue}
                addRow={addRow}
                deleteRow={deleteRow}
                editRow={editRow}
                editingId={editingId}
                setEditingId={setEditingId}
                rows={rows}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
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
