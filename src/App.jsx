import React, { useState, useEffect } from 'react';
import { Calculator, Timer, TrendingUp, Target, Lightbulb, Zap, Heart, MessageCircle, ChevronDown } from 'lucide-react';

const App = () => {
  const [targetTime, setTargetTime] = useState({ hours: 0, minutes: 30, seconds: 0 });
  const [selectedDistance, setSelectedDistance] = useState('5K');
  const [paceStrategies, setPaceStrategies] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [openFAQ, setOpenFAQ] = useState(null);

  const distances = {
    '5K': 5,
    '10K': 10,
    '21K': 21.097,
    '42K': 42.195
  };

  const raceTips = {
    '5K': {
      title: "5K Race Tips",
      tips: [
        "Start at your goal pace - don't go out too fast",
        "Focus on negative splits for personal bests",
        "Practice 400m and 800m repeats for speed development",
        "Stay relaxed in your shoulders and arms",
        "Use the final 400m to kick hard"
      ],
      icon: <Zap className="w-5 h-5" />
    },
    '10K': {
      title: "10K Race Tips",
      tips: [
        "Negative split strategy works well for this distance",
        "Practice running at race pace for 3-5K segments",
        "Stay hydrated but don't overdo it at water stations",
        "Break the race into 2K segments mentally",
        "Save 10-15 seconds for a strong finish"
      ],
      icon: <Heart className="w-5 h-5" />
    },
    '21K': {
      title: "Half Marathon Tips",
      tips: [
        "Start 10-15 seconds per mile slower than goal pace",
        "Fuel with energy gels at 60-90 minute intervals",
        "Practice long runs of 16-18K at easy pace",
        "Stay consistent with your hydration strategy",
        "Break into 5K segments and focus on one at a time"
      ],
      icon: <Timer className="w-5 h-5" />
    },
    '42K': {
      title: "Marathon Tips",
      tips: [
        "Start 30-45 seconds per mile slower than goal pace",
        "Stick to your fueling plan - practice during training",
        "Run your own race, don't get caught up in early pace",
        "Mental strategies: mantras, splitting race into quarters",
        "The marathon starts at mile 20 - prepare for it"
      ],
      icon: <Target className="w-5 h-5" />
    }
  };

  const faqs = [
    {
      question: "What must I do if I cramp?",
      answer: "Stop immediately and gently stretch the cramped muscle. Massage the area and hydrate with electrolyte-rich fluids. For calf cramps, straighten your leg and pull your toes toward your shin. Prevention includes proper hydration, electrolyte balance, and regular stretching."
    },
    {
      question: "What's best strategy to prepare the day before?",
      answer: "Rest completely and avoid intense exercise. Eat a carbohydrate-rich meal 3-4 hours before bedtime. Stay well-hydrated but limit fluid intake 2 hours before sleep. Lay out your gear, review your race plan, and get 7-9 hours of quality sleep. Avoid alcohol and new foods."
    },
    {
      question: "Tips for recovery",
      answer: "Within 30 minutes post-race, consume protein and carbohydrates. Stay hydrated and consider gentle walking or light stretching. Take rest days seriously, get adequate sleep, and consider ice baths or massage. Gradually return to training with easy runs before resuming intensity."
    },
    {
      question: "Coach pro tip",
      answer: "Tabah Sampai Akhir - Perseverance until the end! Mental toughness separates good runners from great ones. Develop race-specific mental strategies during training. Visualize success, break races into manageable chunks, and remember that discomfort is temporary but finishing is forever."
    }
  ];

  const calculatePace = (timeInSeconds, distance) => {
    const paceInSeconds = timeInSeconds / distance;
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePaceStrategies = () => {
    const totalSeconds = targetTime.hours * 3600 + targetTime.minutes * 60 + targetTime.seconds;
    const distance = distances[selectedDistance];

    if (totalSeconds <= 0 || distance <= 0) return [];

    const basePace = totalSeconds / distance;

    // Update animation speed based on pace (faster pace = faster animation)
    const baseAnimationSpeed = Math.max(0.5, Math.min(5, 500 / basePace));
    setAnimationSpeed(baseAnimationSpeed);

    const strategies = [
      {
        name: "Even Pace",
        description: "Maintain consistent pace throughout",
        pace: calculatePace(basePace, 1),
        splits: Array(Math.floor(distance)).fill().map((_, i) => ({
          km: i + 1,
          time: formatTime((i + 1) * basePace)
        }))
      },
      {
        name: "Negative Split",
        description: "Start slower, finish faster",
        pace: calculatePace(basePace * 0.95, 1),
        splits: Array(Math.floor(distance)).fill().map((_, i) => {
          const factor = 1 - (i / Math.floor(distance)) * 0.1;
          return {
            km: i + 1,
            time: formatTime((i + 1) * basePace * factor)
          };
        })
      },
      {
        name: "Positive Split",
        description: "Start faster, settle in later",
        pace: calculatePace(basePace * 1.05, 1),
        splits: Array(Math.floor(distance)).fill().map((_, i) => {
          const factor = 1 + (i / Math.floor(distance)) * 0.1;
          return {
            km: i + 1,
            time: formatTime((i + 1) * basePace * factor)
          };
        })
      },
      {
        name: "Conservative Start",
        description: "Easy start, strong finish",
        pace: calculatePace(basePace * 0.9, 1),
        splits: Array(Math.floor(distance)).fill().map((_, i) => {
          const midPoint = Math.floor(distance / 2);
          return {
            km: i + 1,
            time: formatTime((i + 1) * basePace * (i < midPoint ? 1.1 : 0.9))
          };
        })
      }
    ];

    return strategies;
  };

  useEffect(() => {
    setPaceStrategies(generatePaceStrategies());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime, selectedDistance]);

  const handleTimeChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setTargetTime(prev => ({
      ...prev,
      [field]: Math.max(0, numValue)
    }));
  };

  const NarutoRunningAnimation = ({ speed, strategyName }) => {
    return (
      <div className="relative h-40 bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 rounded-lg overflow-hidden mb-6 border-2 border-orange-200">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-600 to-green-400"></div>

        {/* Clouds */}
        <div className="absolute top-4 left-10 w-16 h-8 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-8 right-20 w-12 h-6 bg-white rounded-full opacity-70"></div>

        {/* Naruto Runner */}
        <div 
          className="absolute bottom-6 w-12 h-16"
          style={{
            animation: `narutoRun ${3 / speed}s linear infinite`,
            left: '-50px'
          }}
        >
          <svg viewBox="0 0 48 64" className="w-full h-full">
            {/* Body */}
            <ellipse cx="24" cy="35" rx="8" ry="12" fill="#FFD700" />

            {/* Head */}
            <circle cx="24" cy="15" r="10" fill="#FFDBAC" />

            {/* Hair */}
            <path d="M14 10 Q20 5 24 8 Q28 5 34 10 Q30 15 24 12 Q18 15 14 10" fill="#FF8C00" />

            {/* Headband */}
            <rect x="16" y="18" width="16" height="3" fill="#00008B" />

            {/* Legs - alternating for running effect */}
            <g id="legs">
              <line x1="20" y1="47" x2="18" y2="55" stroke="#FFD700" strokeWidth="4" />
              <line x1="28" y1="47" x2="30" y2="55" stroke="#FFD700" strokeWidth="4" />
            </g>

            {/* Arms - alternating for running effect */}
            <g id="arms">
              <line x1="16" y1="30" x2="10" y2="35" stroke="#FFD700" strokeWidth="4" />
              <line x1="32" y1="30" x2="38" y2="25" stroke="#FFD700" strokeWidth="4" />
            </g>

            {/* Whisker Marks */}
            <line x1="18" y1="18" x2="22" y2="18" stroke="#000" strokeWidth="1" />
            <line x1="18" y1="20" x2="22" y2="20" stroke="#000" strokeWidth="1" />
            <line x1="26" y1="18" x2="30" y2="18" stroke="#000" strokeWidth="1" />
            <line x1="26" y1="20" x2="30" y2="20" stroke="#000" strokeWidth="1" />
          </svg>
        </div>

        {/* Speed Lines */}
        <div 
          className="absolute bottom-8 w-20 h-2 bg-gradient-to-r from-orange-400 to-transparent opacity-60"
          style={{
            animation: `speedLines ${0.5 / speed}s linear infinite`,
            left: '-70px'
          }}
        ></div>

        <div className="absolute top-4 right-4 bg-orange-500/90 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">
          {strategyName}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <style>{`
        @keyframes narutoRun {
          0% { 
            transform: translateX(0) translateY(0);
          }
          25% { 
            transform: translateX(25vw) translateY(-8px);
          }
          50% { 
            transform: translateX(50vw) translateY(0);
          }
          75% { 
            transform: translateX(75vw) translateY(-8px);
          }
          100% { 
            transform: translateX(100vw) translateY(0);
          }
        }

        @keyframes speedLines {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }

        #legs, #arms {
          animation: limbMovement 0.3s linear infinite;
        }

        @keyframes limbMovement {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .faq-content.open {
          max-height: 1000px;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Naruto Pace Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your race strategy with ninja speed! Calculate optimal paces and splits for your target time across different distances.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Target Time Input */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Target className="w-6 h-6 mr-2 text-orange-600" />
                Target Time
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={targetTime.hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-20 px-4 py-3 text-lg border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </div>
                <div className="text-3xl text-gray-400">:</div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={targetTime.minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-20 px-4 py-3 text-lg border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </div>
                <div className="text-3xl text-gray-400">:</div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-2">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={targetTime.seconds}
                    onChange={(e) => handleTimeChange('seconds', e.target.value)}
                    className="w-20 px-4 py-3 text-lg border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </div>
              </div>
            </div>

            {/* Distance Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
                Distance
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(distances).map((distance) => (
                  <button
                    key={distance}
                    onClick={() => setSelectedDistance(distance)}
                    className={`px-6 py-4 rounded-xl font-medium transition-all duration-200 border-2 ${
                      selectedDistance === distance
                        ? 'bg-orange-500 text-white shadow-lg transform scale-105 border-orange-600'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
                    }`}
                  >
                    {distance}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animation Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ninja Pace Visualization</h3>
          <p className="text-gray-600 mb-4">Watch Naruto's speed change based on your target pace - faster times = faster running!</p>
          <NarutoRunningAnimation speed={animationSpeed} strategyName="Current Pace" />
          <div className="text-center text-sm text-gray-500">
            Animation Speed: {animationSpeed.toFixed(1)}x (Believe it! Faster pace = faster ninja!)
          </div>
        </div>

        {/* Race Tips Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200">
          <div className="flex items-center mb-6">
            <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">{raceTips[selectedDistance].title}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {raceTips[selectedDistance].tips.map((tip, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8 mb-8">
          {paceStrategies.map((strategy, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{strategy.name}</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{strategy.pace}</div>
                    <div className="text-orange-100">per km</div>
                  </div>
                </div>
                <p className="text-orange-100 mt-2">{strategy.description}</p>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <NarutoRunningAnimation 
                    speed={animationSpeed * (strategy.name === "Negative Split" ? 1.3 : strategy.name === "Positive Split" ? 0.7 : 1)} 
                    strategyName={strategy.name} 
                  />
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-4">Kilometer Splits</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {strategy.splits.map((split, splitIndex) => (
                    <div key={splitIndex} className="bg-orange-50 rounded-lg p-4 text-center hover:bg-orange-100 transition-colors duration-200 border border-orange-200">
                      <div className="text-sm font-medium text-orange-600">KM {split.km}</div>
                      <div className="text-lg font-bold text-gray-800">{split.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section - At the end */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Runner's FAQ</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-green-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-green-600 transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div className={`faq-content ${openFAQ === index ? 'open' : ''}`}>
                  <div className="px-6 py-4 bg-white border-t border-green-100">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Made by Giodio Mitaart - Good luck on your upcoming race!</p>
        </div>
      </div>
    </div>
  );
};

export default App;
