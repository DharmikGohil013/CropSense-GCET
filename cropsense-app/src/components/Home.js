import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const cities = [
    // Major Metropolitan Cities
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
    'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar',
    'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
    'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
    'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubballi-Dharwad', 'Tiruchirappalli',
    'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar',
    'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner',
    'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
    
    // Additional Major Cities
    'Surat', 'Jamnagar', 'Bhavnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana',
    'Morbi', 'Navsari', 'Bharuch', 'Vapi', 'Godhra', 'Palanpur', 'Veraval', 'Porbandar',
    'Surendranagar', 'Bhuj', 'Gandhidham', 'Jetpur', 'Gondal', 'Botad', 'Amreli',
    
    // Rajasthan Cities
    'Udaipur', 'Ajmer', 'Bharatpur', 'Alwar', 'Bhilwara', 'Sikar', 'Pali', 'Sri Ganganagar',
    'Kishangarh', 'Beawar', 'Tonk', 'Churu', 'Barmer', 'Jaisalmer', 'Jhunjhunu',
    'Hanumangarh', 'Nagaur', 'Sawai Madhopur', 'Banswara', 'Dungarpur', 'Bundi',
    
    // Maharashtra Cities
    'Kolhapur', 'Sangli', 'Satara', 'Latur', 'Akola', 'Ahmednagar', 'Chandrapur',
    'Jalgaon', 'Dhule', 'Nanded', 'Parbhani', 'Bid', 'Hingoli', 'Washim', 'Yavatmal',
    'Wardha', 'Gadchiroli', 'Bhandara', 'Gondia', 'Buldhana', 'Osmanabad', 'Raigad',
    'Sindhudurg', 'Ratnagiri', 'Usmanabad', 'Jalna', 'Aurangabad', 'Beed',
    
    // Uttar Pradesh Cities
    'Moradabad', 'Muzaffarnagar', 'Mathura', 'Budaun', 'Rampur', 'Shahjahanpur',
    'Farrukhabad', 'Kheri', 'Sitapur', 'Hardoi', 'Unnao', 'Rae Bareli', 'Barabanki',
    'Faizabad', 'Ambedkar Nagar', 'Sultanpur', 'Bahraich', 'Shrawasti', 'Balrampur',
    'Gonda', 'Siddharthnagar', 'Basti', 'Sant Kabir Nagar', 'Maharajganj', 'Kushinagar',
    'Deoria', 'Azamgarh', 'Mau', 'Ballia', 'Jaunpur', 'Ghazipur', 'Chandauli',
    'Varanasi', 'Sant Ravidas Nagar', 'Mirzapur', 'Sonbhadra', 'Allahabad', 'Kaushambi',
    'Pratapgarh', 'Chitrakoot', 'Banda', 'Hamirpur', 'Mahoba', 'Jhansi', 'Lalitpur',
    'Jalaun', 'Mathura', 'Hathras', 'Etah', 'Kasganj', 'Mainpuri', 'Firozabad',
    'Etawah', 'Auraiya', 'Kanpur Dehat', 'Kanpur Nagar', 'Fatehpur', 'Kannauj',
    
    // Tamil Nadu Cities
    'Vellore', 'Tirunelveli', 'Erode', 'Dindigul', 'Thanjavur', 'Cuddalore', 'Karur',
    'Nagapattinam', 'Pudukkottai', 'Ramanathapuram', 'Sivaganga', 'Theni', 'Virudhunagar',
    'Tenkasi', 'Tirupathur', 'Ranipet', 'Kallakurichi', 'Chengalpattu', 'Kanchipuram',
    'Tiruvallur', 'Villupuram', 'Tiruvannamalai', 'Krishnagiri', 'Dharmapuri',
    'Namakkal', 'Perambalur', 'Ariyalur', 'Nilgiris', 'Coimbatore', 'Tiruppur',
    
    // Karnataka Cities
    'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur',
    'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Gadag-Betageri', 'Robertsonpet',
    'Hassan', 'Bhadravati', 'Chitradurga', 'Udupi', 'Kolar', 'Mandya', 'Chikmagalur',
    'Gangavati', 'Bagalkot', 'Ranebennuru', 'Mysuru', 'Shivamogga', 'Belagavi',
    
    // Kerala Cities
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki',
    'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
    'Kannur', 'Kasaragod', 'Kochi', 'Calicut', 'Thalassery', 'Payyanur', 'Kanhangad',
    
    // Andhra Pradesh & Telangana Cities
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
    'Kadapa', 'Kakinada', 'Anantapur', 'Tirupati', 'Chittoor', 'Srikakulam',
    'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni',
    'Tenali', 'Proddatur', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal',
    'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Tadipatri', 'Tadepalligudem',
    'Chilakaluripet', 'Yemmiganur', 'Kadiri', 'Chirala', 'Anakapalli', 'Kavali',
    'Palacole', 'Sullurpeta', 'Tanuku', 'Rayachoti', 'Srikalahasti', 'Bapatla',
    'Naidupet', 'Nagari', 'Markapur', 'Pithapuram', 'Sattenapalle', 'Vinukonda',
    
    // West Bengal Cities
    'Siliguri', 'Asansol', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra',
    'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj',
    'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat',
    'Bankura', 'Chakdaha', 'Darjeeling', 'Alipurduar', 'Purulia', 'Jangipur',
    'Bolpur', 'Bangaon', 'Cooch Behar', 'Medinipore', 'Raghunathganj', 'Tehatta',
    'Egra', 'Bidhannagar', 'Hugli-Chinsurah', 'Tamluk', 'Madhyamgram', 'Panihati',
    'Kamarhati', 'Baranagar', 'Serampore', 'Naihati', 'Baidyabati', 'Konnagar',
    'Rishra', 'Bansberia', 'Uttarpara', 'Kanchrapara', 'Gayeshpur', 'Kalyani',
    'Barrackpore', 'Dum Dum', 'Rajarhat', 'New Town', 'Bidhannagar', 'Rajpur Sonarpur',
    
    // Odisha Cities
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore',
    'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Barbil', 'Khordha', 'Paradip',
    'Angul', 'Dhenkanal', 'Kendujhar', 'Sundargarh', 'Phulbani', 'Koraput',
    'Rayagada', 'Nabarangpur', 'Kalahandi', 'Nuapada', 'Balangir', 'Subarnapur',
    'Boudh', 'Kandhamal', 'Nayagarh', 'Ganjam', 'Gajapati', 'Mayurbhanj', 'Jajpur',
    
    // Assam Cities
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
    'Bongaigaon', 'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara',
    'Barpeta', 'Mangaldoi', 'Nalbari', 'Rangia', 'Diphu', 'Hojai', 'Lanka',
    'Lumding', 'Morigaon', 'Nowgong', 'Marigaon', 'Golaghat', 'Haflong', 'Hailakandi',
    
    // Punjab Cities
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur',
    'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara',
    'Muktsar', 'Barnala', 'Rajpura', 'Hoshiarpur', 'Kapurthala', 'Faridkot',
    'Sunam', 'Sangrur', 'Fazilka', 'Gurdaspur', 'Kharar', 'Gobindgarh', 'Mansa',
    'Malout', 'Nabha', 'Tarn Taran', 'Jagraon', 'Dhuri', 'Samana', 'Fatehgarh Sahib',
    
    // Haryana Cities
    'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar',
    'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind',
    'Thanesar', 'Kaithal', 'Rewari', 'Narnaul', 'Pundri', 'Kosli', 'Palwal',
    'Hansi', 'Narwana', 'Meham', 'Israna', 'Taraori', 'Ladwa', 'Sohna', 'Safidon',
    'Tauru', 'Assandh', 'Hathin', 'Kalka', 'Rania', 'Ellenabad', 'Fatehabad',
    
    // Himachal Pradesh Cities
    'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan',
    'Paonta Sahib', 'Sundernagar', 'Chamba', 'Una', 'Kullu', 'Hamirpur', 'Bilaspur',
    'Yol', 'Talai', 'Daulatpur Chowk', 'Ghagal', 'Kangra', 'Santokhgarh', 'Mehatpur',
    'Shamshi', 'Parwanoo', 'Manali', 'Kasauli', 'Dalhousie', 'Keylong', 'Reckong Peo',
    
    // Uttarakhand Cities
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani-cum-Kathgodam', 'Rudrapur', 'Kashipur',
    'Rishikesh', 'Ramnagar', 'Pithoragarh', 'Jaspur', 'Kichha', 'Sitarganj',
    'Bageshwar', 'Tehri', 'Pauri', 'Kotdwar', 'Nagla', 'Manglaur', 'Nainital',
    'Mussoorie', 'Almora', 'Rudraprayag', 'Chamoli', 'Uttarkashi', 'Champawat',
    
    // Jharkhand Cities
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro',
    'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Pakaur',
    'Chaibasa', 'Jhumri Telaiya', 'Saunda', 'Chakradharpur', 'Mihijam', 'Patratu',
    'Gumla', 'Dumka', 'Madhupur', 'Chatra', 'Wadrafnagar', 'Chas', 'Chandil',
    'Hussainabad', 'Gomoh', 'Bundu', 'Jamtara', 'Koderma', 'Khunti', 'Godda',
    
    // Chhattisgarh Cities
    'Raipur', 'Bhilai Nagar', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur',
    'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri', 'Bhatapara',
    'Dalli-Rajhara', 'Naila Janjgir', 'Tilda Newra', 'Mungeli', 'Manendragarh',
    'Sakti', 'Akaltara', 'Dongargarh', 'Champa', 'Janjgir-Champa', 'Kanker',
    'Kawardha', 'Kondagaon', 'Narayanpur', 'Bastar', 'Sukma', 'Dantewada',
    
    // Madhya Pradesh Cities
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
    'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena',
    'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh',
    'Mandsaur', 'Khargone', 'Neemuch', 'Pithampur', 'Narmadapuram', 'Itarsi',
    'Sehore', 'Mhow', 'Seoni', 'Balaghat', 'Ashok Nagar', 'Tikamgarh', 'Shahdol',
    'Panna', 'Raisen', 'Lahar', 'Maihar', 'Sanawad', 'Sendhwa', 'Manawar',
    
    // Northeast States Cities
    'Shillong', 'Imphal', 'Aizawl', 'Agartala', 'Kohima', 'Itanagar', 'Gangtok',
    'Tura', 'Churachandpur', 'Bishnupur', 'Thoubal', 'Lunglei', 'Champhai',
    'Serchhip', 'Kolasib', 'Lawngtlai', 'Saiha', 'Dharmanagar', 'Kailasahar',
    'Belonia', 'Khowai', 'Teliamura', 'Sabroom', 'Udaipur', 'Sonamura',
    'Wokha', 'Mokokchung', 'Tuensang', 'Mon', 'Zunheboto', 'Kiphire', 'Longleng',
    'Peren', 'Dimapur', 'Naharlagun', 'Pasighat', 'Along', 'Yupia', 'Ziro',
    'Bomdila', 'Tawang', 'Changlang', 'Tezu', 'Khonsa', 'Anini', 'Daporijo',
    'Basar', 'Roing', 'Namsai', 'Namchi', 'Geyzing', 'Mangan', 'Rangpo',
    
    // Union Territories
    'Port Blair', 'Kavaratti', 'Daman', 'Diu', 'Silvassa', 'Dadra', 'Nagar Haveli'
  ];

  const handleSearch = async (cityToSearch = cityName) => {
    if (!cityToSearch.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    
    // Simulate API call for city analysis
    setTimeout(() => {
      const searchResults = {
        city: cityToSearch,
        climate: 'Tropical',
        temperature: '25-35°C',
        humidity: '60-80%',
        rainfall: '800-1200mm',
        soilType: 'Alluvial',
        recommendedCrops: ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'],
        season: 'Kharif',
        irrigation: 'Required',
        fertilizers: ['Urea', 'NPK', 'Organic Compost'],
        cropYield: {
          rice: 85,
          wheat: 72,
          cotton: 68,
          sugarcane: 91,
          maize: 76
        },
        monthlyRainfall: [45, 32, 28, 15, 85, 180, 220, 195, 165, 95, 25, 18],
        soilHealth: {
          nitrogen: 78,
          phosphorus: 65,
          potassium: 82,
          organic: 71,
          ph: 6.8
        }
      };
      
      setIsLoading(false);
      
      // Navigate to results page with data
      navigate('/results', { state: { searchResults } });
    }, 1500);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityName(value);
    
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setCityName(city);
    setShowSuggestions(false);
    handleSearch(city);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Left Side - SVG Illustration */}
        <div className="home-visual">
          <div className="crop-illustration">
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="crop-svg"
            >
              {/* Farm Background */}
              <rect width="400" height="400" fill="url(#farmGradient)" />
              
              {/* Sun */}
              <circle cx="320" cy="80" r="30" fill="#FFD700" opacity="0.8" />
              <g stroke="#FFD700" strokeWidth="2" opacity="0.6">
                <line x1="290" y1="50" x2="280" y2="40" />
                <line x1="310" y1="40" x2="320" y2="30" />
                <line x1="330" y1="40" x2="340" y2="30" />
                <line x1="350" y1="50" x2="360" y2="40" />
                <line x1="360" y1="70" x2="370" y2="80" />
                <line x1="360" y1="90" x2="370" y2="100" />
                <line x1="350" y1="110" x2="360" y2="120" />
                <line x1="330" y1="120" x2="340" y2="130" />
              </g>
              
              {/* Mountains/Hills */}
              <path d="M0 120 Q100 80 200 120 Q300 160 400 120 V400 H0 Z" fill="url(#hillGradient)" opacity="0.3" />
              
              {/* Crops/Plants */}
              <g className="crop-plants">
                {/* Wheat stalks */}
                <g transform="translate(80, 200)">
                  <path d="M0 120 Q-5 100 0 80 Q5 60 0 40 Q-3 20 0 0" stroke="#D4AF37" strokeWidth="3" fill="none" />
                  <circle cx="0" cy="10" r="2" fill="#DAA520" />
                  <circle cx="-3" cy="20" r="2" fill="#DAA520" />
                  <circle cx="3" cy="30" r="2" fill="#DAA520" />
                  <circle cx="-2" cy="40" r="2" fill="#DAA520" />
                </g>
                
                <g transform="translate(120, 210)">
                  <path d="M0 110 Q-4 90 0 70 Q4 50 0 30 Q-2 10 0 0" stroke="#D4AF37" strokeWidth="3" fill="none" />
                  <circle cx="0" cy="8" r="2" fill="#DAA520" />
                  <circle cx="-2" cy="18" r="2" fill="#DAA520" />
                  <circle cx="2" cy="28" r="2" fill="#DAA520" />
                </g>
                
                {/* Rice plants */}
                <g transform="translate(160, 220)">
                  <path d="M0 100 Q-6 80 0 60 Q6 40 0 20 Q-4 10 0 0" stroke="#228B22" strokeWidth="4" fill="none" />
                  <path d="M-10 20 Q-5 15 0 20 Q5 15 10 20" stroke="#32CD32" strokeWidth="2" fill="none" />
                  <path d="M-8 40 Q-3 35 0 40 Q3 35 8 40" stroke="#32CD32" strokeWidth="2" fill="none" />
                </g>
                
                <g transform="translate(200, 215)">
                  <path d="M0 105 Q-5 85 0 65 Q5 45 0 25 Q-3 15 0 0" stroke="#228B22" strokeWidth="4" fill="none" />
                  <path d="M-8 25 Q-3 20 0 25 Q3 20 8 25" stroke="#32CD32" strokeWidth="2" fill="none" />
                </g>
                
                {/* Cotton plants */}
                <g transform="translate(240, 200)">
                  <path d="M0 120 L0 0" stroke="#2E8B57" strokeWidth="4" />
                  <circle cx="0" cy="30" r="8" fill="#F5F5DC" opacity="0.9" />
                  <circle cx="-8" cy="50" r="6" fill="#F5F5DC" opacity="0.8" />
                  <circle cx="8" cy="70" r="7" fill="#F5F5DC" opacity="0.9" />
                  <path d="M-15 40 Q0 30 15 40" stroke="#228B22" strokeWidth="2" fill="none" />
                  <path d="M-12 60 Q0 50 12 60" stroke="#228B22" strokeWidth="2" fill="none" />
                </g>
                
                {/* Corn stalks */}
                <g transform="translate(280, 190)">
                  <path d="M0 130 L0 0" stroke="#3CB371" strokeWidth="5" />
                  <ellipse cx="0" cy="40" rx="4" ry="15" fill="#FFD700" />
                  <path d="M-20 60 Q0 50 20 60" stroke="#228B22" strokeWidth="3" fill="none" />
                  <path d="M-18 80 Q0 70 18 80" stroke="#228B22" strokeWidth="3" fill="none" />
                  <path d="M-15 100 Q0 90 15 100" stroke="#228B22" strokeWidth="3" fill="none" />
                </g>
              </g>
              
              {/* Ground/Soil */}
              <rect x="0" y="320" width="400" height="80" fill="url(#soilGradient)" />
              
              {/* Animated elements */}
              <g className="floating-particles">
                <circle cx="50" cy="150" r="2" fill="#00FF7F" opacity="0.6">
                  <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="350" cy="180" r="1.5" fill="#64FFDA" opacity="0.5">
                  <animate attributeName="cy" values="180;170;180" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="100" r="1" fill="#00FF7F" opacity="0.7">
                  <animate attributeName="cy" values="100;90;100" dur="5s" repeatCount="indefinite" />
                </circle>
              </g>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="farmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a0a0a" />
                  <stop offset="50%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <linearGradient id="hillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#064E3B" />
                  <stop offset="100%" stopColor="#00FF7F" />
                </linearGradient>
                <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#654321" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Side - Search Section */}
        <div className="home-search">
          <div className="search-section">
            <h1 className="home-title">Discover Your City's Crop Potential</h1>
            <p className="home-subtitle">Enter your city name to get comprehensive agricultural analysis and recommendations</p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="search-form">
              <div className="search-input-container">
                <svg 
                  className="search-icon" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  value={cityName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => cityName.length > 0 && setShowSuggestions(true)}
                  onBlur={handleInputBlur}
                  placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                  className="search-input"
                />
                {isLoading && (
                  <div className="loading-spinner-small"></div>
                )}
                
                {/* City Suggestions Dropdown */}
                {showSuggestions && filteredCities.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredCities.map((city, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(city)}
                      >
                        <svg className="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>


          </div>
        </div>
      </div>

      {/* Extended Content Section */}
      <div className="extended-content">
        {/* Features Section */}
        <div className="features-section">
          <div className="container">
            <h2 className="section-title handwriting-font">Smart Farming Solutions</h2>
            <p className="section-subtitle">Revolutionize your agricultural practices with AI-powered insights and precision farming technologies</p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#00FF7F"/>
                    <path d="M19 11L19.75 13.5L22 14L19.75 14.5L19 17L18.25 14.5L16 14L18.25 13.5L19 11Z" fill="#064E3B"/>
                    <path d="M5 5L5.5 6.5L7 7L5.5 7.5L5 9L4.5 7.5L3 7L4.5 6.5L5 5Z" fill="#00FF7F"/>
                  </svg>
                </div>
                <h3>AI-Powered Analysis</h3>
                <p>Advanced machine learning algorithms analyze soil conditions, weather patterns, and crop health to provide personalized recommendations for optimal yields.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#00FF7F"/>
                    <path d="M21 9V7L15 6L13 7H11L9 6L3 7V9L9 8V22H11V16H13V22H15V8L21 9Z" fill="#064E3B"/>
                    <circle cx="8" cy="10" r="2" fill="#00FF7F"/>
                    <circle cx="16" cy="12" r="1.5" fill="#00FF7F"/>
                  </svg>
                </div>
                <h3>Precision Farming</h3>
                <p>Monitor crop health in real-time using satellite imagery and IoT sensors to optimize irrigation, fertilization, and pest management strategies.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21L9 18L15 21L21 18V3L15 6L9 3L3 3Z" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                    <path d="M9 3V18" stroke="#064E3B" strokeWidth="2"/>
                    <path d="M15 6V21" stroke="#064E3B" strokeWidth="2"/>
                    <circle cx="7" cy="8" r="1" fill="#00FF7F"/>
                    <circle cx="17" cy="12" r="1" fill="#00FF7F"/>
                    <circle cx="11" cy="15" r="1" fill="#00FF7F"/>
                  </svg>
                </div>
                <h3>Weather Forecasting</h3>
                <p>Get accurate long-term weather predictions and climate analysis to plan your farming activities and protect crops from adverse conditions.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3.09 8.26L4 21L20 21L20.91 8.26L12 2Z" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                    <path d="M12 8V16" stroke="#064E3B" strokeWidth="2"/>
                    <path d="M8 12H16" stroke="#064E3B" strokeWidth="2"/>
                    <circle cx="9" cy="10" r="1" fill="#00FF7F"/>
                    <circle cx="15" cy="14" r="1" fill="#00FF7F"/>
                  </svg>
                </div>
                <h3>Market Intelligence</h3>
                <p>Access real-time market prices, demand forecasts, and supply chain insights to maximize profitability and reduce post-harvest losses.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium AI Packages Section */}
        <div className="premium-section">
          <div className="container">
            <div className="premium-header">
              <h2 className="section-title handwriting-font">Premium AI Packages</h2>
              <p className="section-subtitle">Unlock the full potential of smart agriculture with our advanced AI-powered solutions</p>
            </div>

            <div className="packages-grid">
              {/* Basic Package */}
              <div className="package-card">
                <div className="package-header">
                  <div className="package-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00FF7F"/>
                      <path d="M2 17L12 22L22 17" stroke="#064E3B" strokeWidth="2" fill="none"/>
                      <path d="M2 12L12 17L22 12" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                  <h3>Basic AI</h3>
                  <div className="package-price">
                    <span className="currency">₹</span>
                    <span className="amount">2,999</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <div className="package-features">
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Basic crop analysis</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Weather forecasting</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Soil health monitoring</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Basic reports</span>
                  </div>
                </div>
                <button className="package-button">Get Started</button>
              </div>

              {/* Professional Package - Highlighted */}
              <div className="package-card featured">
                <div className="featured-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#000"/>
                  </svg>
                  Most Popular
                </div>
                <div className="package-header">
                  <div className="package-icon premium">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L3.09 8.26L4 21L20 21L20.91 8.26L12 2Z" fill="#FFD700"/>
                      <path d="M12 8L9 12H15L12 8Z" fill="#FF6B35"/>
                      <circle cx="12" cy="15" r="2" fill="#FF6B35"/>
                    </svg>
                  </div>
                  <h3>Professional AI</h3>
                  <div className="package-price">
                    <span className="currency">₹</span>
                    <span className="amount">7,999</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <div className="package-features">
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>Advanced crop analytics</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>Satellite monitoring</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>Disease detection AI</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>Precision irrigation</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>Market predictions</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#FFD700" strokeWidth="2"/>
                    </svg>
                    <span>24/7 support</span>
                  </div>
                </div>
                <button className="package-button premium">Upgrade Now</button>
              </div>

              {/* Enterprise Package */}
              <div className="package-card">
                <div className="package-header">
                  <div className="package-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3H22L20 21H4L2 3Z" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                      <path d="M8 7V17" stroke="#064E3B" strokeWidth="2"/>
                      <path d="M12 7V17" stroke="#064E3B" strokeWidth="2"/>
                      <path d="M16 7V17" stroke="#064E3B" strokeWidth="2"/>
                      <circle cx="8" cy="5" r="1" fill="#00FF7F"/>
                      <circle cx="12" cy="5" r="1" fill="#00FF7F"/>
                      <circle cx="16" cy="5" r="1" fill="#00FF7F"/>
                    </svg>
                  </div>
                  <h3>Enterprise AI</h3>
                  <div className="package-price">
                    <span className="currency">₹</span>
                    <span className="amount">15,999</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <div className="package-features">
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Full AI suite</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Custom AI models</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Multi-farm management</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>API access</span>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="9" stroke="#00FF7F" strokeWidth="2"/>
                    </svg>
                    <span>Dedicated support</span>
                  </div>
                </div>
                <button className="package-button">Contact Sales</button>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="technology-section">
          <div className="container">
            <h2 className="section-title handwriting-font">Powered by Advanced Technology</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" fill="#00FF7F"/>
                    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="8" stroke="#00FF7F" strokeWidth="1" fill="none" strokeDasharray="2 2"/>
                  </svg>
                </div>
                <h3>Satellite Imagery</h3>
                <p>High-resolution satellite data for precise field monitoring and crop health assessment</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00FF7F"/>
                    <path d="M2 17L12 22L22 17" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    <circle cx="8" cy="9" r="1" fill="#064E3B"/>
                    <circle cx="16" cy="9" r="1" fill="#064E3B"/>
                    <circle cx="12" cy="15" r="1" fill="#064E3B"/>
                  </svg>
                </div>
                <h3>Machine Learning</h3>
                <p>Advanced algorithms that learn from your farm data to provide personalized insights</p>
              </div>
              
              <div className="tech-item">
                <div className="tech-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="19" cy="6" r="2" fill="#00FF7F"/>
                    <circle cx="19" cy="18" r="2" fill="#00FF7F"/>
                  </svg>
                </div>
                <h3>IoT Integration</h3>
                <p>Seamless connectivity with sensors and smart farming equipment for real-time monitoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8V16H8V8H16Z" fill="#00FF7F"/>
                    <path d="M2 2V22H22V2H2Z" stroke="#064E3B" strokeWidth="2" fill="none"/>
                    <path d="M6 6V18M10 6V18M14 6V18M18 6V18" stroke="#064E3B" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Farmers Empowered</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#00FF7F" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#064E3B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="stat-number">2M+</div>
                <div className="stat-label">Acres Monitored</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13H9L11 7L13 17L15 11H21" stroke="#00FF7F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="7" cy="13" r="2" fill="#064E3B"/>
                    <circle cx="17" cy="11" r="2" fill="#064E3B"/>
                  </svg>
                </div>
                <div className="stat-number">35%</div>
                <div className="stat-label">Average Yield Increase</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.27L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" fill="#FFD700"/>
                  </svg>
                </div>
                <div className="stat-number">4.9</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
