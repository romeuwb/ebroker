"use client"
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";

const unitData = {
    squareFeet: {
        name: "Square Feet",
        convertFactor: 1,
    },
    squareMeter: {
        name: "Square Meter",
        convertFactor: 0.092903,
    },
    acre: {
        name: "Acre",
        convertFactor: 0.00002295,
    },
    hectare: {
        name: "Hectare",
        convertFactor: 0.000009,
    },
    gaj: {
        name: "Gaj",
        convertFactor: 0.112188,
    },
    bigha: {
        name: "Bigha",
        convertFactor: 0.000037,
    },
    cent: {
        name: "Cent",
        convertFactor: 0.002296,
    },
    katha: {
        name: "Katha",
        convertFactor: 0.000735,
    },
    guntha: {
        name: "Guntha",
        convertFactor: 0.0009182,
    },
};

const AreaConverter = ({ isOpen, onClose }) => {
    const [value, setValue] = useState("");
    const [fromUnit, setFromUnit] = useState("squareFeet");
    const [toUnit, setToUnit] = useState("squareMeter");
    const [convertedValue, setConvertedValue] = useState("");

    const handleValueChange = (event) => {
        setValue(event.target.value);
        setConvertedValue("");
    };

    const handleFromUnitChange = (event) => {
        setFromUnit(event.target.value);
        setConvertedValue("");
    };

    const handleToUnitChange = (event) => {
        setToUnit(event.target.value);
        setConvertedValue("");
    };

    const convertValue = () => {
        const fromFactor = unitData[fromUnit].convertFactor;
        const toFactor = unitData[toUnit].convertFactor;

        if (fromFactor && toFactor) {
            const converted = (parseFloat(value) / fromFactor) * toFactor;
            setConvertedValue(converted);
        }
    };

    return (
        <div>
            <Modal show={isOpen} onHide={onClose} size="md" centered className="areaConvert-modal">
                <Modal.Header>
                    <Modal.Title>Area Converter</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onClose} />
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-body-heading">
                        <h4>Convert Area</h4>
                        <span>Enter the value and desired units:</span>
                    </div>
                    <div className="area-conrt-fields">
                        <div className="sq-ft">
                            <label>From:</label>
                            <div className="btn-group" role="group">
                                <input
                                    type="number"
                                    value={value}
                                    onChange={handleValueChange}
                                    placeholder="Enter the value"
                                    id="number-input"
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = 0;
                                        }
                                    }}
                                />
                                <select value={fromUnit} onChange={handleFromUnitChange} id="sq-ft-slct">
                                    {Object.keys(unitData).map((unitKey) => (
                                        <option key={unitKey} value={unitKey}>
                                            {unitData[unitKey].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="sq-ft">
                            <label>To:</label>
                            <div>
                                <select onChange={handleToUnitChange} id="sq-m">
                                    {Object.keys(unitData).map((unitKey) => (
                                        <option key={unitKey} value={unitKey}>
                                            {unitData[unitKey].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {convertedValue && (
                        <div id="show-value">
                            <span className="convert-value">
                                {value} {unitData[fromUnit].name} = {convertedValue} {unitData[toUnit].name}
                            </span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="area-footer">
                    <button className="convert-button" onClick={convertValue}>
                        Convert
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AreaConverter;
