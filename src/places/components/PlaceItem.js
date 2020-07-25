import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import MapRendered from '../../shared/components/UIElements/Map'
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './PlaceItem.css'

const PlaceItem = props => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [showMap, setMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const toggleMapHandler = () => {
        setMap(!showMap)
    }

    const showdeleteWarningHandler = () => setShowConfirmModal(true)

    const cancelDeleteHandler = () => setShowConfirmModal(false)

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false)
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
                'DELETE',
                null,
                { Authorization:'Bearer ' + auth.token }
            );
            props.onDelete(props.id);
        } catch (err) { }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={toggleMapHandler}
                header={props.address}
                footer={<Button onClick={toggleMapHandler}>CLOSE</Button>}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
            >
                <div className="map-container">
                    <MapRendered coordinates={Object.values(props.coordinates)} />
                </div>
            </Modal>

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass='place-item__modal-actions'
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>
                    Do you want to proceed and delete this place?Please note that it
                    can't be undone thereafter.
          </p>
            </Modal>

            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={toggleMapHandler}>VIEW ON MAP</Button>

                        {auth.userId===props.creatorId && (
                            <React.Fragment>
                                <Button inverse to={`/places/${props.id}`}>EDIT</Button>
                                <Button danger onClick={showdeleteWarningHandler}>DELETE</Button>
                            </React.Fragment>
                        )}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};
export default PlaceItem