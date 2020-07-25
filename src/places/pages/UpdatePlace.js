import React, { useEffect,useState,useContext } from 'react'
import { useParams,useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css'


const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState()
    const placeId = useParams().placeId
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, true)

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
                setLoadedPlace(responseData.place)
                setFormData({
                    title: {
                      value: responseData.place.title,
                      isValid: true
                    },
                    description: {
                      value: responseData.place.description,
                      isValid: true
                    }
                  },true)
            } catch (err) { }
        }
        fetchPlaces()
    }, [sendRequest, placeId,setFormData])


    const placeSubmitHandler =async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
              'PATCH',
              JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
              }),
              {
                'Content-Type': 'application/json',
                Authorization:'Bearer ' + auth.token
              }
            );
            history.push('/' + auth.userId + '/places');
        } catch (err) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner/>
            </div>
        )
    }

    if (!loadedPlace && ! error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place</h2>
                </Card>

            </div>
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlace && ( <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    value={loadedPlace.title}      //This is initial Value
                    valid={true}    //This is inital validity
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (min. 5 characters)."
                    onInput={inputHandler}
                    value={loadedPlace.description}     //This is initial Value
                    valid={true}   //This is inital validity
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form> )}
        </React.Fragment>
    )
}

export default UpdatePlace;