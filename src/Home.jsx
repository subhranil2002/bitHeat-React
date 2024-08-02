import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import io from 'socket.io-client';

function Home() {
  const [heartRate, setHeartRate] = useState(0);
  const [bloodPressure, setBloodPressure] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const socket = io();

    socket.on('data', (data) => {
      const parsedData = parseInt(data, 10);
      setSteps(parsedData);
      setCalories(parsedData * 0.033);
    });

    const generateRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const updateHeartRate = () => {
      setHeartRate(generateRandomValue(60, 100));
    };

    const updateBloodPressure = () => {
      setBloodPressure(generateRandomValue(70, 82));
    };

    const updateChartData = () => {
      setChartData((prevData) => [
        ...prevData,
        { name: new Date().toLocaleTimeString(), heartRate, bloodPressure, calories },
      ]);
    };

    const heartRateInterval = setInterval(updateHeartRate, 2000);
    const bloodPressureInterval = setInterval(updateBloodPressure, 2000);
    const chartDataInterval = setInterval(updateChartData, 2000);

    // Initial update
    updateHeartRate();
    updateBloodPressure();
    updateChartData();

    return () => {
      clearInterval(heartRateInterval);
      clearInterval(bloodPressureInterval);
      clearInterval(chartDataInterval);
      socket.disconnect();
    };
  }, [heartRate, bloodPressure, calories, steps]);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Dashboard</h3>
      </div>
      <div className='main-cards'>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h5 style={{ color: 'white' }}>Heart Rate</h5>
          </div>
          <h1>{heartRate}</h1>
          <h7>Beats per minute</h7>
        </div>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h3 style={{ color: 'white' }}>Blood Pressure</h3>
          </div>
          <h1>{bloodPressure}</h1>
          <h5>mm Hg</h5>
        </div>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h3 style={{ color: 'white' }}>Steps</h3>
          </div>
          <h1 id='stepsData'>{steps}</h1>
          <h7>Number of Steps</h7>
        </div>
        <div className='card' style={{ borderRadius: '10px' }}>
          <div className='card-inner'>
            <h3 style={{ color: 'white' }}>Calories</h3>
          </div>
          <h1>{calories.toFixed(2)}</h1>
          <h7>kilo joules</h7>
        </div>
      </div>
      <br/>
      <h3>Your Health Data Chart</h3>
      <div className='charts'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='heartRate' fill='#8884d8' />
            <Bar dataKey='bloodPressure' fill='#82ca9d' />
            <Bar dataKey='calories' fill='#ffc658' />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='heartRate' stroke='#8884d8' activeDot={{ r: 8 }} />
            <Line type='monotone' dataKey='bloodPressure' stroke='#82ca9d' />
            <Line type='monotone' dataKey='calories' stroke='#ffc658' />
          </LineChart>
        </ResponsiveContainer>
        <div className='healthStatus'>
          <h3>Check your Health Status</h3>
        </div>
        <div className='heartStatus'>
          <h3>Check your Heart Status</h3>
        </div>
      </div>
    </main>
  );
}

export default Home;
