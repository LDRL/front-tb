import React, { CSSProperties, useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { FormDropdown, FormInputDropdown, FormInputText, FormTextArea } from '@/components';
import { Controller, useForm } from 'react-hook-form';
import { Product } from '../../models';

import CardForm from '../../../../components/Cards/CardForm'

import { RootState } from '@/redux/store';
import { fetchProductCreate, fetchProductUpdate, productUrl } from '../../services/product';
import LoadMask from '@/components/LoadMask/LoadMask';
import { useFetchMarcaOptions, useFetchOptions, useFetchPresentacionOptions } from '../../hooks/useFetchOptions';

import "./ProductCreate.css"
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { PrivateRoutes } from '@/models';


interface FormValues{
  selectedOption: string;
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CreateProduct: React.FC = () => {
  const [loading , setLoading] = useState<boolean>(false);
  const [color, setColor] = useState("#ffffff")
  const navigate = useNavigate();


  const { currentProduct } = useSelector((state: RootState) => state.product);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<Product>({
    defaultValues: { id: 0, name: '', price: 0 },
  });

  const {data: options, isLoading, isError} = useFetchOptions();
  const {data: marcaOptions, isLoading: isMarcaLoading, isError: isMarcaError} = useFetchMarcaOptions();

  const {data: presentacionOptions, isLoading: isPresentacionLoading, isError: isPresentacionError} = useFetchPresentacionOptions();

  useEffect(() => {
    if (currentProduct) {
      reset(currentProduct);
    } else {
      reset({ id: 0, name: '', price: 0});
    }
  }, [currentProduct, reset]);


  const onSubmit = async (data: Product) => {
    setLoading(true);
    try {
      // let responseData;
      if (currentProduct) {
        // Update the product
 
        const [err, responseData] = await fetchProductUpdate(productUrl, data);
 
        if (err) throw new Error(err.message);
      } else {
        // Create a new product
         const [err, responseData] = await fetchProductCreate(productUrl, data);
       }
      navigate(`/private/${PrivateRoutes.PRODUCT}`, {replace:true})

      // navigate(`/${PrivateRoutes.PRIVATE}`, {replace:true});

    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false); // Desactiva el loader
    }

  };

  if (isLoading){
    return <p>Cargando opciones ....</p>
  }
  if(isError){
    return <p>Error al cargar las opciones</p>
  }

  if (isMarcaLoading){
    return <p>Cargando opciones ....</p>
  }
  if(isMarcaError){
    return <p>Error al cargar las opciones</p>
  }

  if (isPresentacionLoading){
    return <p>Cargando opciones ....</p>
  }
  if(isPresentacionError){
    return <p>Error al cargar las opciones</p>
  }

  return (
    // <div className='container'>
    //   <header className='header'><p>Texto header</p></header>

    //   <section className="area1">
    //     <p>Title</p>
    //     <p>Filtros</p>
    //   </section>
    //   <section className="area2">
    //     <p>Buscador</p>
    //   </section>
    //   <section className="main">
    //   <Box
    //       component="form"
    //       onSubmit={handleSubmit(onSubmit)}
    //       autoComplete="off"
    //     >
    //       <FormInputText
    //           name="name"
    //           control={control}
    //           label="Product Name"
    //           rules={{ required: 'Product name is required' }}
    //         />
    //       <Controller
    //         name="price"
    //         control={control}
    //         rules={{ required: 'Product price is required' }}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             required
    //             margin="dense"
    //             id="price"
    //             label="Product Price"
    //             type="number"
    //             fullWidth
    //             variant="standard"
    //             error={!!errors.price}
    //             helperText={errors.price ? errors.price.message : ''}
    //           />
    //         )}
    //       />

    //       <FormTextArea
    //         name="descripcion"
    //         control={control}
    //         label="Descripción"
    //         rules={{required: 'Descripción es un campo requerido'}}
    //         // value={text}
    //         // onChange={handleTextChange}
    //         rows={6}
    //         placeholder="Escribe algo aquí..."
    //         helperText="Máximo 500 caracteres"
          
    //         />
    //       <Controller
    //         name="price"
    //         control={control}
    //         rules={{ required: 'Product price is required' }}
    //         render={({ field }) => (
    //           <TextField
    //             {...field}
    //             required
    //             margin="dense"
    //             id="price"
    //             label="Product Price"
    //             type="number"
    //             fullWidth
    //             variant="standard"
    //             error={!!errors.price}
    //             helperText={errors.price ? errors.price.message : ''}
    //           />
    //         )}
    //       />

    //       <FormDropdown
    //         name="categoria"
    //         control={control}
    //         label="categoria......"
    //         rules={{ required: 'categorie name is required' }}
    //         options={options || []}
    //       />


    //       <FormDropdown
    //         name="marca"
    //         control={control}
    //         label="marca"
    //         rules={{ required: 'marca name is required' }}
    //         options={marcaOptions || []}
    //       />
          
    //       <FormDropdown
    //         name="presentacion"
    //         control={control}
    //         label="presentacion"
    //         rules={{ required: 'presentación es un campo requerido' }}
    //         options={presentacionOptions || []}
    //       />

    //       <Button
    //         variant="outlined"
    //         type="submit"
    //         sx={{ mt: 2 }}
    //       >
    //         Submit
    //       </Button>
    //     </Box>
    //   </section>
    // </div>

    
    <div className='container'>
      {loading && (
                <div className="sweet-loading">
                     
                <ClipLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}

      <CardForm
        titulo='Producto'
        subtitulo='nuevo'
      >
        <LoadMask
        />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <div className='section'>
            <FormInputText
                name="name"
                control={control}
                label="Nombre producto"
                rules={{ required: 'Product name is required' }}
              />
            {/* <Controller
              name="price"
              control={control}
              rules={{ required: 'Product price is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  margin="dense"
                  id="price"
                  label="Product Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  error={!!errors.price}
                  helperText={errors.price ? errors.price.message : ''}
                />
              )}
            /> */}
          </div>

          <div className='container_selector'>
              <FormDropdown
                name="idcategoria"
                control={control}
                label="categoria......"
                rules={{ required: 'categorie name is required' }}
                options={options || []}
                
              />
            
              <FormDropdown
                name="idmarca"
                control={control}
                label="marca"
                rules={{ required: 'marca name is required' }}
                options={marcaOptions || []}
              />         

              <FormDropdown
                name="idpresentacion"
                control={control}
                label="presentacion"
                rules={{ required: 'presentación es un campo requerido' }}
                options={presentacionOptions || []}
              /> 
          </div>

          <div className='section'>
            <FormTextArea
              name="descripcion"
              control={control}
              label="Descripción"
              rules={{required: 'Descripción es un campo requerido'}}
              // value={text}
              // onChange={handleTextChange}
              rows={6}
              placeholder="Escribe algo aquí..."
              helperText="Máximo 500 caracteres"
              />
            </div>
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
