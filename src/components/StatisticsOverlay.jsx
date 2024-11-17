import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import './StatisticsOverlay.scss';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const StatisticsOverlay = ({ onClose, brothers }) => {
    const overlayRef = useRef(null);
    const barChartContainerRef = useRef(null);
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [showLineChart, setShowLineChart] = useState(false);
    const [hobbiesCountLimit, setHobbiesCountLimit] = useState(5);
    const [currentWindow, setCurrentWindow] = useState(0);
    const WINDOW_SIZE = 10;
    const ITEM_HEIGHT = 40; // Height per bar in pixels

    useEffect(() => {
        const handleClose = (e) => {
            if (e.target === overlayRef.current) {
                onClose();
            }
        };

        document.addEventListener('click', handleClose);
        return () => {
            document.removeEventListener('click', handleClose);
        };
    }, [onClose]);

    // Prepare data for the pie chart (nationality distribution)
    const nationalityData = useMemo(() => {
        return brothers.reduce((acc, brother) => {
            if (brother.nationalities && brother.nationalities.length > 0) {
                brother.nationalities.forEach((country) => {
                    acc[country.name] = (acc[country.name] || 0) + 1;
                });
            } else {
                acc['Unknown'] = (acc['Unknown'] || 0) + 1;
            }
            return acc;
        }, {});
    }, [brothers]);

    const nationalityLabels = Object.keys(nationalityData);
    const nationalityCounts = Object.values(nationalityData);

    const pieData = {
        labels: nationalityLabels,
        datasets: [
            {
                label: 'Ethnicity by Nationality',
                data: nationalityCounts,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF',
                    '#8E44AD',
                    '#2980B9',
                    '#27AE60',
                    '#E67E22',
                    '#E74C3C',
                    '#2ECC71',
                    '#F1C40F',
                    '#E84393',
                    '#D35400',
                    '#1ABC9C',
                    '#34495E',
                ],
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Nationality Distribution',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = nationalityCounts.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    // Prepare data for the bar chart (majors prevalence)
    const majorData = useMemo(() => {
        return brothers.reduce((acc, brother) => {
            if (brother.major && brother.major.trim() !== '') {
                acc[brother.major.trim()] = (acc[brother.major.trim()] || 0) + 1;
            } else {
                acc['Unknown'] = (acc['Unknown'] || 0) + 1;
            }
            return acc;
        }, {});
    }, [brothers]);

    const majorLabels = Object.keys(majorData);
    const majorCounts = Object.values(majorData);

    // Calculate total windows and total scrollable height
    const totalWindows = Math.ceil(majorLabels.length / WINDOW_SIZE);
    const totalScrollHeight = totalWindows * WINDOW_SIZE * ITEM_HEIGHT;

    // Scroll handler
    useEffect(() => {
        const container = barChartContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const newWindow = Math.floor(scrollTop / (WINDOW_SIZE * ITEM_HEIGHT));

            if (newWindow !== currentWindow && newWindow >= 0 && newWindow < totalWindows) {
                setCurrentWindow(newWindow);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [currentWindow, totalWindows]);

    // Determine visible data based on current window
    const visibleMajorLabels = useMemo(() => {
        const start = currentWindow * WINDOW_SIZE;
        return majorLabels.slice(start, start + WINDOW_SIZE);
    }, [currentWindow, majorLabels]);

    const visibleMajorCounts = useMemo(() => {
        const start = currentWindow * WINDOW_SIZE;
        return majorCounts.slice(start, start + WINDOW_SIZE);
    }, [currentWindow, majorCounts]);

    const barData = {
        labels: visibleMajorLabels,
        datasets: [
            {
                label: 'Major Prevalence',
                data: visibleMajorCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Major Prevalence',
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const major = visibleMajorLabels[index];
                setSelectedMajors((prev) => {
                    if (!prev.includes(major)) {
                        return [...prev, major];
                    } else {
                        return prev.filter((item) => item !== major);
                    }
                });
                setShowLineChart(true);
            }
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Number of Brothers',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    // Prepare data for hobbies table
    const hobbiesData = useMemo(() => {
        const hobbiesCount = brothers.reduce((acc, brother) => {
            if (brother.hobbies && brother.hobbies.length > 0) {
                brother.hobbies.forEach((hobby) => {
                    acc[hobby] = (acc[hobby] || 0) + 1;
                });
            }
            return acc;
        }, {});

        // Sort hobbies by count and take top n
        return Object.entries(hobbiesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, hobbiesCountLimit)
            .map(([hobby, count]) => ({ hobby, count }));
    }, [brothers, hobbiesCountLimit]);

    const handleHobbiesLimitChange = (e) => {
        setHobbiesCountLimit(Number(e.target.value));
    };

    // Define a fixed range of years for the x-axis based on crossing_year and graduating_year
    const currentYear = new Date().getFullYear();
    const earliestCrossingYear = useMemo(() => {
        const years = brothers
            .map((brother) => parseInt(brother.crossing_year))
            .filter((year) => !isNaN(year));
        return years.length > 0 ? Math.min(...years) : currentYear;
    }, [brothers]);

    const latestGraduationYear = useMemo(() => {
        const years = brothers
            .map((brother) => parseInt(brother.graduating_year))
            .filter((year) => !isNaN(year));
        return years.length > 0 ? Math.max(...years) : currentYear;
    }, [brothers]);

    const startYear = earliestCrossingYear < 2010 ? earliestCrossingYear : 2010; // Adjust start year as needed
    const endYear = latestGraduationYear > currentYear ? latestGraduationYear : currentYear;

    const years = useMemo(() => {
        return Array.from(
            { length: endYear - startYear + 1 },
            (_, i) => (startYear + i).toString()
        );
    }, [startYear, endYear]);

    // Extract unique majors for the line chart
    const uniqueMajors = useMemo(() => {
        return Array.from(new Set(brothers.map((brother) => brother.major).filter(Boolean)));
    }, [brothers]);

    // Assign distinct colors to each major
    const colorPalette = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#8E44AD',
        '#2980B9',
        '#27AE60',
        '#E67E22',
        '#E74C3C',
        '#2ECC71',
        '#F1C40F',
        '#E84393',
        '#D35400',
        '#1ABC9C',
        '#34495E',
    ];

    // Prepare datasets for the line chart based on graduation year
    const lineDatasets = useMemo(() => {
        return uniqueMajors.map((major, index) => {
            // Initialize counts for each year to 0
            const countsPerYear = years.reduce((acc, year) => {
                acc[year] = 0;
                return acc;
            }, {});

            // Count the number of brothers per major per year who are active during that year
            brothers.forEach((brother) => {
                if (brother.major === major) {
                    const crossingYear = parseInt(brother.crossing_year);
                    const graduatingYear = parseInt(brother.graduating_year);

                    if (isNaN(crossingYear)) return; // Skip if crossing_year is invalid

                    // Determine the active period
                    const start = crossingYear;
                    const end = isNaN(graduatingYear) ? currentYear : graduatingYear;

                    // Increment count for each year in the active period
                    years.forEach((yearStr) => {
                        const year = parseInt(yearStr);
                        if (year >= start && year <= end) {
                            countsPerYear[yearStr] += 1;
                        }
                    });
                }
            });

            return {
                label: major,
                data: years.map((year) => countsPerYear[year]),
                borderColor: colorPalette[index % colorPalette.length],
                backgroundColor: colorPalette[index % colorPalette.length],
                fill: false,
                tension: 0.1,
            };
        });
    }, [uniqueMajors, brothers, years, colorPalette, currentYear]);

    const selectedLineDatasets = selectedMajors
        .map((major) => lineDatasets.find((dataset) => dataset.label === major))
        .filter(Boolean); // Ensure no undefined datasets

    const lineData = {
        labels: years,
        datasets: selectedLineDatasets,
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text:
                    selectedMajors.length > 0
                        ? 'Major Prevalence Over Years'
                        : 'Click the bar chart majors to show prevalence over the years. Click again to remove from the graph.',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 20,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Active Brothers',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return createPortal(
        <div
            className="statistics-overlay"
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="statistics-overlay-title"
        >
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close Statistics Overlay"
                >
                    &times;
                </button>
                <h2 id="statistics-overlay-title">Brother Statistics</h2>

                <div className="charts-container">
                    <div className="charts-column">
                        {/* Pie Chart for Nationality Distribution */}
                        <div className="chart">
                            <Pie data={pieData} options={pieOptions} />
                        </div>

                        {/* Scrollable Bar Chart Container */}
                        <div
                            className="chart-scroll-container"
                            style={{
                                height: `${WINDOW_SIZE * ITEM_HEIGHT}px`,
                                overflowY: 'scroll',
                                position: 'relative',
                            }}
                            ref={barChartContainerRef}
                        >
                            {/* Invisible div to create scrollable area */}
                            <div style={{ height: `${totalScrollHeight}px` }} />
                        </div>

                        {/* Bar Chart for Major Prevalence */}
                        <div className="chart" style={{ height: `${WINDOW_SIZE * ITEM_HEIGHT}px` }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className="charts-column">
                        {/* Hobbies Table */}
                        <div className="hobbies-table-container">
                            <label htmlFor="hobbies-limit">Top hobbies to display:</label>
                            <select
                                id="hobbies-limit"
                                value={hobbiesCountLimit}
                                onChange={handleHobbiesLimitChange}
                            >
                                {[5, 10].map((limit) => (
                                    <option key={limit} value={limit}>
                                        {limit}
                                    </option>
                                ))}
                            </select>
                            <table className="hobbies-table">
                                <thead>
                                    <tr>
                                        <th>Hobby</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hobbiesData.map(({ hobby, count }) => (
                                        <tr key={hobby}>
                                            <td>{hobby}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Line Chart for Major Prevalence Over Years (Active Brothers) */}
                        <div className="line-chart-container">
                            <Line data={lineData} options={lineOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StatisticsOverlay;
