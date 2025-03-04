import React, { useState } from "react";
import { Container, Form, Button, Card, Table } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faArrowLeft,
  faArrowRight,
  faCalculator,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

// Calculate Biorhythm data for the past 30 days centered on the selected date
const calculateBiorhythm = (birthDate, selectedDate) => {
  const birth = moment(birthDate);
  const days = Array.from({ length: 30 }, (_, i) =>
    moment(selectedDate).subtract(15, "days").add(i, "days")
  );

  return days
    .map((day) => {
      const diff = moment(day).diff(birth, "days");
      return {
        date: day,
        physical: Math.round(
          ((Math.sin((2 * Math.PI * diff) / 23) + 1) / 2) * 100
        ),
        emotional: Math.round(
          ((Math.sin((2 * Math.PI * diff) / 28) + 1) / 2) * 100
        ),
        intellectual: Math.round(
          ((Math.sin((2 * Math.PI * diff) / 33) + 1) / 2) * 100
        ),
      };
    })
    .map((d) => ({
      ...d,
      average: Math.round((d.physical + d.emotional + d.intellectual) / 3),
    }));
};

// Chart component displaying the biorhythm data
const BiorhythmChart = ({ data, onPointClick }) => {
  const options = {
    chart: {
      type: "spline",
    },
    title: { text: "Biểu đồ Nhịp Sinh Học" },
    xAxis: {
      categories: data.map((d) => moment(d.date).format("YYYY-MM-DD")),
    },
    yAxis: { title: { text: "Phần trăm (%)" }, min: 0, max: 100 },
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              onPointClick(this.category);
            },
          },
        },
      },
    },
    series: [
      { name: "Sức khỏe", data: data.map((d) => d.physical), color: "red" },
      { name: "Tình cảm", data: data.map((d) => d.emotional), color: "blue" },
      {
        name: "Trí tuệ",
        data: data.map((d) => d.intellectual),
        color: "green",
      },
      { name: "Trung bình", data: data.map((d) => d.average), color: "purple" },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

// Table component displaying biorhythm data for a selected date
const BiorhythmTable = ({ data, selectedDate }) => {
  const filteredData = data.filter((d) =>
    moment(d.date).isSame(selectedDate, "day")
  );

  return (
    <Table size="lg" striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>Ngày</th>
          <th>Sức khỏe (%)</th>
          <th>Tình cảm (%)</th>
          <th>Trí tuệ (%)</th>
          <th>Trung bình (%)</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          <tr>
            <td>{moment(filteredData[0].date).format("YYYY-MM-DD")}</td>
            <td>{filteredData[0].physical}</td>
            <td>{filteredData[0].emotional}</td>
            <td>{filteredData[0].intellectual}</td>
            <td>{filteredData[0].average}</td>
          </tr>
        ) : (
          <tr>
            <td colSpan="5">Không có dữ liệu cho ngày này</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

const BiorhythmApp = () => {
  const [birthDate, setBirthDate] = useState("1961-09-26");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [chartData, setChartData] = useState(
    calculateBiorhythm(birthDate, selectedDate)
  );
  const [viewDate, setViewDate] = useState(selectedDate);

  const updateChart = (date) => {
    setChartData(calculateBiorhythm(birthDate, date));
  };

  const handlePointClick = (date) => {
    setSelectedDate(date);
    updateChart(date);
    setViewDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateChart(viewDate);
  };

  const handleDayChange = (days) => {
    const newDate = moment(selectedDate).add(days, "days").format("YYYY-MM-DD");
    setSelectedDate(newDate);
    updateChart(newDate);
    setViewDate(newDate);
  };

  const handleToday = () => {
    const today = moment().format("YYYY-MM-DD");
    setSelectedDate(today);
    updateChart(today);
    setViewDate(today);
  };

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="birthDate">
            <Form.Label>Ngày sinh:</Form.Label>
            <Form.Control
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="viewDate" className="mt-3">
            <Form.Label>Ngày muốn xem:</Form.Label>
            <Form.Control
              type="date"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
            />
          </Form.Group>

          <Button className="mt-2" type="submit" variant="primary" block>
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Tính
          </Button>
        </Form>
      </Card>

      {chartData.length > 0 && (
        <Card className="mt-4 p-4">
          <div className="d-flex justify-content-between mb-3">
            <Button variant="warning" onClick={() => handleDayChange(-7)}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </Button>
            <Button variant="secondary" onClick={() => handleDayChange(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button variant="success" onClick={handleToday}>
              <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
              Hôm nay
            </Button>
            <Button variant="secondary" onClick={() => handleDayChange(1)}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <Button variant="warning" onClick={() => handleDayChange(7)}>
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Button>
          </div>
          <BiorhythmTable data={chartData} selectedDate={viewDate} />
          <BiorhythmChart data={chartData} onPointClick={handlePointClick} />
        </Card>
      )}
    </Container>
  );
};

export default BiorhythmApp;
