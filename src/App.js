import React from "react";
import { Container } from "react-bootstrap";
import BiorhythmApp from "./BiorhythmApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  return (
    <Container className="mt-4">
      <h1 className="text-center">
        <FontAwesomeIcon icon={faChartLine} className="me-2" />
        Nhịp sinh học
      </h1>
      <BiorhythmApp />
    </Container>
  );
};

export default App;
