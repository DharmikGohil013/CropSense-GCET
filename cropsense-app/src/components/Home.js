import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            <h1 className="home-title">{t('home.title')}</h1>
            <p className="home-subtitle">{t('home.subtitle')}</p>
            
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
                  placeholder={t('home.searchPlaceholder')}
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
              
              <button 
                type="submit" 
                className="search-button"
                disabled={isLoading || !cityName.trim()}
              >
                {isLoading ? t('home.analyzing') : t('home.searchButton')}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
