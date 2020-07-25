import {useCallback,useReducer} from 'react'

const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid }
          },
          isValid: formIsValid
        };
        case 'SET_DATA':
          return {
            inputs:action.inputs,
            isValid:action.formIsValid
          }
      default:
        return state;
    }
};



export const useForm=(initialInputs,initialFormValidity)=>{
    const [formState, dispatch] = useReducer(formReducer, {
        inputs:initialInputs,
        isValid: initialFormValidity
      }); 

    //UseCallbacks is to prevent infinite loop.
    //And if in this function we now do anything that changes to state of the new place component and re renders
    //it, what will happen technically is that a new title Input handler function gets created because we create
    //this function instead of the function.So whenever a component function runs this function is recreated 
    //even if it has the same logic as before.
    //By useCallback no new function object is created whatever the function the component function renders but that
    //instead this function is reused and doesn't change and that then does not lead to use of fact to run again.
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
        type: 'INPUT_CHANGE',
        value: value,
        isValid: isValid,
        inputId: id
        });
    }, []);

    const setFormData=useCallback((inputData,formValidity)=>{
      dispatch({
        type:"SET_DATA",
        inputs:inputData,
        formIsValid:formValidity
      })
    },[])

    return [formState,inputHandler,setFormData]
}


