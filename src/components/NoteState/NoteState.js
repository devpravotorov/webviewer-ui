import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object,
  isSelected: PropTypes.bool,
  openOnInitialLoad: PropTypes.bool,
  handleStateChange: PropTypes.func
};

function NoteState(props) {
  const {
    annotation,
    isSelected = false,
    openOnInitialLoad = false,
    handleStateChange,
  } = props;

  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(openOnInitialLoad);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    setIsOpen(false);
  });

  const togglePopup = e => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  function onStateOptionsButtonClick() {
    setIsOpen(false);
  }

  function createOnStateOptionButtonClickHandler(state) {
    return function onStateOptionButtonClick() {
      if (handleStateChange) {
        handleStateChange(state);
      }
    };
  }

  if (!annotation) {
    return null;
  }

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const isReply = annotation.isReply();

  if ((annotationState === '' || annotationState === 'None') && !isSelected) {
    return null;
  }

  if (isReply) {
    return null;
  }

  return (
    <DataElementWrapper
      className="NoteState"
      dataElement="noteState"
      onClick={togglePopup}
    >
      <div className="overflow">
        <Icon glyph={icon} />
      </div>
      {isOpen && (
        <button ref={popupRef} className="note-state-options" onClick={onStateOptionsButtonClick}>
          <DataElementWrapper dataElement="notePopupState">
            <DataElementWrapper
              dataElement="notePopupStateAccepted"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Accepted')}
            >
              <Icon glyph="icon-annotation-status-accepted" />
              {t('option.state.accepted')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateRejected"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Rejected')}
            >
              <Icon glyph="icon-annotation-status-rejected" />
              {t('option.state.rejected')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateCancelled"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Cancelled')}
            >
              <Icon glyph="icon-annotation-status-cancelled" />
              {t('option.state.cancelled')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateCompleted"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Completed')}
            >
              <Icon glyph="icon-annotation-status-completed" />
              {t('option.state.completed')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateNone"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('None')}
            >
              <Icon glyph="icon-annotation-status-none" />
              {t('option.state.none')}
            </DataElementWrapper>
          </DataElementWrapper>
        </button>
      )}
    </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
