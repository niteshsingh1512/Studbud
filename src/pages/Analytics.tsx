import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BehaviorList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/get-all");
        console.log(response.data);
        setData(response.data.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {return (<div className="flex justify-center items-center h-screen bg-gray-100">
  <motion.div
    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  ></motion.div>
</div>)}
  if (error) return <p className="text-red-500">{error}</p>;

  // Prepare data for the chart (convert seconds to hours)
  const chartData = data.map((item) => ({
    website: item.website,
    timeSpent: (item.timeSpent / 360).toFixed(2), // Convert seconds to hours (2 decimal places)
  }));

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">User Behavior Data</h2>

      {/* Bar Chart */}
      <div className="w-full h-80  bg-white rounded-lg shadow p-10 mb-6">
        <h3 className="text-lg font-semibold mb-2">Time Spent on Websites (mins)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="website" />
            <YAxis tickFormatter={(tick) => `${tick} mins`} /> {/* Format Y-axis as hours */}
            <Tooltip formatter={(value) => `${value} mins`} />
            <Bar dataKey="timeSpent" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Website List */}
      <div className="space-y-4">
        {data.length === 0 ? (
          <p>No data available</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="p-10 bg-white rounded-lg shadow">
              <div
                className="cursor-pointer flex justify-between items-center"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold">{item.website}</h3>
                <span className="text-gray-500">{expandedIndex === index ? "▲" : "▼"}</span>
              </div>

              {expandedIndex === index && (
                <div className="mt-2 border-t pt-2">
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Clicks:</strong> {item.clicks}</p>
                  <p><strong>Time Spent:</strong> {(item.timeSpent / 360).toFixed(2)} mins</p>

                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BehaviorList;
