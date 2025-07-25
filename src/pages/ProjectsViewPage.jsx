import { useState } from 'react';
import { FiHome, FiCode, FiArrowLeft, FiMail } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';

const techBadges = {
  "Python": "https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54",
  "Bash Script": "https://img.shields.io/badge/bash_script-%23121011.svg?style=flat&logo=gnu-bash&logoColor=white",
  "Swift": "https://img.shields.io/badge/swift-F54A2A?style=flat&logo=swift&logoColor=white",
  "AWS": "https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white",
  "Azure": "https://img.shields.io/badge/azure-%230072C6.svg?style=flat&logo=microsoftazure&logoColor=white",
  "Firebase": "https://img.shields.io/badge/firebase-%23039BE5.svg?style=flat&logo=firebase",
  "Oracle": "https://img.shields.io/badge/Oracle-F80000?style=flat&logo=oracle&logoColor=white",
  "Anaconda": "https://img.shields.io/badge/Anaconda-%2344A833.svg?style=flat&logo=anaconda&logoColor=white",
  "Django": "https://img.shields.io/badge/django-%23092E20.svg?style=flat&logo=django&logoColor=white",
  "Flask": "https://img.shields.io/badge/flask-%23000.svg?style=flat&logo=flask&logoColor=white",
  "Flutter": "https://img.shields.io/badge/Flutter-%2302569B.svg?style=flat&logo=Flutter&logoColor=white",
  "Next JS": "https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white",
  "NodeJS": "https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white",
  "Jinja": "https://img.shields.io/badge/jinja-white.svg?style=flat&logo=jinja&logoColor=black",
  "MySQL": "https://img.shields.io/badge/mysql-4479A1.svg?style=flat&logo=mysql&logoColor=white",
  "MongoDB": "https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white",
  "Keras": "https://img.shields.io/badge/Keras-%23D00000.svg?style=flat&logo=Keras&logoColor=white",
  "Matplotlib": "https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=flat&logo=Matplotlib&logoColor=black",
  "mlflow": "https://img.shields.io/badge/mlflow-%23d9ead3.svg?style=flat&logo=numpy&logoColor=blue",
  "NumPy": "https://img.shields.io/badge/numpy-%23013243.svg?style=flat&logo=numpy&logoColor=white",
  "Pandas": "https://img.shields.io/badge/pandas-%23150458.svg?style=flat&logo=pandas&logoColor=white",
  "Plotly": "https://img.shields.io/badge/Plotly-%233F4F75.svg?style=flat&logo=plotly&logoColor=white",
  "PyTorch": "https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=flat&logo=PyTorch&logoColor=white",
  "scikit-learn": "https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=flat&logo=scikit-learn&logoColor=white",
  "Scipy": "https://img.shields.io/badge/SciPy-%230C55A5.svg?style=flat&logo=scipy&logoColor=%white",
  "TensorFlow": "https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=flat&logo=TensorFlow&logoColor=white",
  "GitHub": "https://img.shields.io/badge/github-%23121011.svg?style=flat&logo=github&logoColor=white",
  "GitLab": "https://img.shields.io/badge/gitlab-%23181717.svg?style=flat&logo=gitlab&logoColor=white",
  "Ansible": "https://img.shields.io/badge/ansible-%231A1918.svg?style=flat&logo=ansible&logoColor=white",
  "Terraform": "https://img.shields.io/badge/terraform-%235835CC.svg?style=flat&logo=terraform&logoColor=white",
  "Postman": "https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white",
  "Perl": "https://img.shields.io/badge/perl-%2339457E.svg?style=flat&logo=perl&logoColor=white",
  "Jira": "https://img.shields.io/badge/jira-%230A0FFF.svg?style=flat&logo=jira&logoColor=white",
  "Grafana": "https://img.shields.io/badge/grafana-%23F46800.svg?style=flat&logo=grafana&logoColor=white",
  "nVIDIA": "https://img.shields.io/badge/nVIDIA-%2376B900.svg?style=flat&logo=nVIDIA&logoColor=white",
  "SQLite": "https://img.shields.io/badge/sqlite-%2307405e.svg?style=flat&logo=sqlite&logoColor=white",
  "HTML": "https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white",
  "CSS": "https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white",
  "vCenter API": "https://img.shields.io/badge/vcenter_api-%230072C6.svg?style=flat&logo=vmware&logoColor=white",
  "Ansible API": "https://img.shields.io/badge/ansible_api-%231A1918.svg?style=flat&logo=ansible&logoColor=white",
  "SSH": "https://img.shields.io/badge/ssh-%23121011.svg?style=flat&logo=linux&logoColor=white",
  "NMON": "https://img.shields.io/badge/nmon-%23121011.svg?style=flat&logo=linux&logoColor=white",
  "docx": "https://img.shields.io/badge/docx-%232A5699.svg?style=flat&logo=microsoft-word&logoColor=white",
  "OpenCV": "https://img.shields.io/badge/opencv-%235C3EE8.svg?style=flat&logo=opencv&logoColor=white",
  "Jupyter Notebook": "https://img.shields.io/badge/jupyter-%23F37626.svg?style=flat&logo=jupyter&logoColor=white",
  "Bootstrap": "https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=flat&logo=bootstrap&logoColor=white",
  "OpenAI API": "https://img.shields.io/badge/openai-%23412991.svg?style=flat&logo=openai&logoColor=white",
  "SpeechRecognition": "https://img.shields.io/badge/speechrecognition-%23121011.svg?style=flat&logo=python&logoColor=white",
  "Text-to-Speech": "https://img.shields.io/badge/text_to_speech-%23121011.svg?style=flat&logo=python&logoColor=white",
  "FastAPI": "https://img.shields.io/badge/fastapi-%23009688.svg?style=flat&logo=fastapi&logoColor=white",
  "Polygon API": "https://img.shields.io/badge/polygon_api-%23121011.svg?style=flat&logo=python&logoColor=white",
  "REST": "https://img.shields.io/badge/rest-%23000000.svg?style=flat&logo=rest&logoColor=white",
  "JavaScript": "https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E",
  "React": "https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB",
  "Vite": "https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white",
  "Axios": "https://img.shields.io/badge/axios-%235A29E4.svg?style=flat&logo=axios&logoColor=white",
  "Docker": "https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white",
  "Microservices": "https://img.shields.io/badge/microservices-%23121011.svg?style=flat&logo=google-cloud&logoColor=white",
  "LLAMA": "https://img.shields.io/badge/llama-%23121011.svg?style=flat&logo=meta-ai&logoColor=white",
  "NLP": "https://img.shields.io/badge/nlp-%23121011.svg?style=flat&logo=python&logoColor=white",
  "Streamlit": "https://img.shields.io/badge/streamlit-%23FF4B4B.svg?style=flat&logo=streamlit&logoColor=white"
};

const projects = [
    {
        "title": "Ansibe-Automation-Projects",
        "url": "https://github1s.com/mtptisid/Ansibe-Automation-Projects",
        "description": "A collection of automation playbooks created using Ansible. This repository includes real-world infrastructure tasks such as provisioning servers, deploying software, and performing OS-level configurations. It supports multi-tier deployment scenarios and includes reusability patterns. Useful for beginners and professionals working with infrastructure automation.",
        "technologies": ["Ansible", "YAML", "Linux", "Automation"]
    },
    {
        "title": "Automating-Ansible-Automation-Platform",
        "url": "https://github1s.com/mtptisid/Automating-Ansible-Automation-Platform",
        "description": "This repository focuses on automating AWX and Ansible Automation Platform (AAP) through APIs. It contains scripts to launch jobs, capture logs, and manage templates programmatically. Ideal for DevOps pipelines or CI/CD scenarios where manual Ansible operations need to be converted into API-based automation.",
        "technologies": ["Python", "Ansible", "REST API", "AWX", "Automation"]
    },
    {
        "title": "Bash-Projects",
        "url": "https://github savo1s.com/mtptisid/Bash-Projects",
        "description": "A curated collection of Bash scripts used for system administration and automation. These include user management, system monitoring, and resource optimization. This repo is great for Linux users and sysadmins who frequently work in CLI environments. Scripts are modular and reusable.",
        "technologies": ["Bash", "Linux", "Shell Scripting", "Cron"]
    },
    {
        "title": "Blood-Transfusion-ML-Model",
        "url": "https://github1s.com/mtptisid/Blood-Transfusion-ML-Model",
        "description": "A machine learning model that predicts whether a person will donate blood using clinical data. The model is built using Random Forest and evaluated with classification metrics. The project includes a Streamlit web app to allow real-time predictions based on user input.",
        "technologies": ["Python", "Scikit-learn", "Streamlit", "Pandas", "RandomForest"]
    },
    {
        "title": "Children_security_Syetem_WITH_RFID",
        "url": "https://github1s.com/mtptisid/Children_security_Syetem_WITH_RFID",
        "description": "This Arduino-based project focuses on child security using RFID technology. It allows guardians or institutions to track children's entry and exit from premises using RFID tags. It includes hardware interfacing, serial communication, and alert systems for safety.",
        "technologies": ["Arduino", "RFID", "Embedded Systems", "C++"]
    },
    {
        "title": "CodeSage-AI-Powered-Documentation-Driven-Development-Suite",
        "url": "https://github1s.com/mtptisid/CodeSage-AI-Powered-Documentation-Driven-Development-Suite",
        "description": "CodeSage is an AI-powered system that reads software documentation and generates implementation code. Built for developers who prefer doc-driven development, this project integrates LLMs with software scaffolding. It speeds up coding tasks and improves documentation adherence.",
        "technologies": ["Python", "LLMs", "LangChain", "OpenAI API", "FastAPI"]
    },
    {
        "title": "Credit-Risk-Analysis-with-CatBoostClassifier",
        "url": "https://github1s.com/mtptisid/Credit-Risk-Analysis-with-CatBoostClassifier",
        "description": "A machine learning pipeline for credit risk analysis using CatBoost, a high-performance gradient boosting library. The model classifies customers into risk categories based on financial features. The project includes EDA, model training, and evaluation using real-world datasets.",
        "technologies": ["Python", "CatBoost", "Pandas", "Seaborn", "Scikit-learn"]
    },
    {
        "title": "crop-recommendation-system",
        "url": "https://github1s.com/mtptisid/crop-recommendation-system",
        "description": "This ML-based recommendation system suggests optimal crops for farmers based on soil nutrients, pH, moisture, and climatic conditions. The project uses decision tree-based models and is aimed at enhancing agricultural productivity. An easy-to-use interface allows farmers to input parameters and receive recommendations.",
        "technologies": ["Python", "Machine Learning", "Streamlit", "Pandas", "Scikit-learn"]
    },
    {
        "title": "data-analystics",
        "url": "https://github1s.com/mtptisid/data-analystics",
        "description": "A data analysis project that uses Python to draw insights from structured datasets. It includes data cleaning, visualization, and basic statistical analysis. This project is useful for anyone learning data analytics workflows using Pandas, Matplotlib, and Seaborn.",
        "technologies": ["Python", "Pandas", "Matplotlib", "Seaborn"]
    },
    {
        "title": "Data_WareHouse_Data_Mining",
        "url": "https://github1s.com/mtptisid/Data_WareHouse_Data_Mining",
        "description": "This project introduces concepts of data warehousing and data mining, with implementations of OLAP queries and clustering. It simulates a real data pipeline where data is transformed, cleaned, and mined for insights. Useful for students and professionals working with large-scale data systems.",
        "technologies": ["SQL", "ETL", "Data Mining", "OLAP", "Clustering"]
    },
    {
        "title": "My-Django-Web-Applications",
        "url": "https://github1s.com/mtptisid/My-Django-Web-Applications",
        "description": "This repository contains Django-based web applications, including a sample login page and a blog application. It serves as a guide for setting up Django projects, with installation instructions for both Linux and Windows environments. The project demonstrates the creation of models, views, and templates, providing a foundational understanding of Django's MVC architecture.",
        "technologies": ["Python", "Django", "SQLite", "HTML", "CSS"]
    },
    {
        "title": "My_Python_Scripts",
        "url": "https://github1s.com/mtptisid/My_Python_Scripts",
        "description": "A collection of Python scripts designed for various automation tasks. These scripts include functionalities such as fetching VM details from vCenter, retrieving Ansible job information, and monitoring CSV data. The repository showcases practical applications of Python in system administration and data processing.",
        "technologies": ["Python", "Jinja", "vCenter API", "Ansible API"]
    },
    {
        "title": "NMON_Analyser_with_Python",
        "url": "https://github1s.com/mtptisid/NMON_Analyser_with_Python",
        "description": "This project automates the collection and analysis of system performance data using NMON files. It connects to remote Linux servers via SSH to fetch NMON files, analyzes the data to generate insights and plots for key system metrics, and creates detailed reports in `.docx` format. The tool also sends email notifications with the generated reports as attachments.",
        "technologies": ["Python", "SSH", "NMON", "Matplotlib", "docx"]
    },
    {
        "title": "open-Cv",
        "url": "https://github1s.com/mtptisid/open-Cv",
        "description": "A repository containing OpenCV tutorials and experiments. It includes Jupyter notebooks demonstrating basic image processing techniques, video capture, and manipulation using OpenCV. The project serves as a learning resource for understanding computer vision concepts.",
        "technologies": ["Python", "OpenCV", "Jupyter Notebook"]
    },
    {
        "title": "Open_CV-With-Flask",
        "url": "https://github1s.com/mtptisid/Open_CV-With-Flask",
        "description": "This project integrates OpenCV with Flask to create a web application that provides real-time video streaming from a webcam. Features include capturing images, recording videos, and managing these media files through a gallery interface. The app utilizes Bootstrap for a responsive layout.",
        "technologies": ["Python", "Flask", "OpenCV", "Bootstrap"]
    },
    {
       "title": "FLAN-T5 Small Fine-Tuning with LoRA",
       "url": "https://github1s.com/mtptisid/FLAN-T5-Small_finetuning_LoRA",
       "description": "A hands-on project to fine-tune FLAN-T5-Small using Low-Rank Adaptation (LoRA) for efficient NLP task adaptation. Demonstrates parameter-efficient fine-tuning (PEFT) techniques using Hugging Face and PEFT libraries. Great for quick experimentation on lower-end GPUs.",
       "technologies": ["Python", "Hugging Face Transformers", "LoRA", "PEFT", "NLP", "FLAN-T5", "Machine Learning"]
    },
    {
        "title": "YOLOv5 Object Detection Practice",
       "url": "https://github1s.com/mtptisid/YOLOV5_Practice",
        "description": "A project showcasing object detection using YOLOv5. Covers custom dataset annotation, model training, and prediction. Useful for learning end-to-end object detection with PyTorch and Roboflow.",
       "technologies": ["Python", "YOLOv5", "PyTorch", "OpenCV", "Computer Vision", "Roboflow"]
    },
    {
       "title": "Custom CNN Image Classifier with PyTorch",
       "url": "https://github1s.com/mtptisid/PyTorch-CNN-model",
       "description": "A basic convolutional neural network implemented in PyTorch for image classification. Demonstrates CNN architecture, forward pass, loss computation, training, and evaluation on small image datasets.",
       "technologies": ["Python", "PyTorch", "Deep Learning", "CNN", "Image Classification"]
    },
    {
        "title": "Personal Voice Assistant with OpenAI",
        "url": "https://github1s.com/mtptisid/Personal_Voice_Assistant_with_OpenAI",
        "description": "A personal voice assistant application that leverages OpenAI's API to process voice commands and provide intelligent responses. The assistant can perform tasks such as fetching information, setting reminders, and more, demonstrating the integration of speech recognition with AI-powered text generation.",
        "technologies": ["Python", "OpenAI API", "SpeechRecognition", "Text-to-Speech"]
    },
    {
        "title": "Python-Web-Application-with-Micro-service",
        "url": "https://github1s.com/mtptisid/Python-Web-Application-with-Micro-service",
        "description": "This project demonstrates the development of a Python-based web application following a microservices architecture. It includes separate services for handling different functionalities, communicating through RESTful APIs. The architecture enhances scalability and maintainability of the application.",
        "technologies": ["Python", "Flask", "Docker", "REST", "Microservices"]
    },
    {
        "title": "Recruitment_Helper_AI_with_LLAMA",
        "url": "https://github1s.com/mtptisid/Recruitment_Helper_AI_with_LLAMA",
        "description": "An AI-powered recruitment assistant that utilizes the LLAMA language model to analyze resumes and job descriptions. It provides insights and recommendations to streamline the hiring process, showcasing the application of large language models in human resources.",
        "technologies": ["Python", "LLAMA", "NLP", "Streamlit"]
    },
    {
        "title": "Scarpe-Web-for-datasets",
        "url": "https://github1s.com/mtptisid/Scarpe-Web-for-datasets",
        "description": "This repository contains a dataset of 55,741 entries from Red Hat Enterprise Linux (RHEL) technical documentation, covering system administration, network configurations, virtualization setups, and enterprise software best practices. The goal is to train and fine-tune a domain-specific LLM that can outperform existing models in answering Red Hat & Linux system administration queries.",
        "technologies": ["Python", "Scrapy", "Linux", "Data Preprocessing"]
    },
    {
        "title": "SIMPLE SQL WITH GOOGLE GEMINI AI",
        "url": "https://github1s.com/mtptisid/SIMPLE_SQL_WITH_GOOGLE_GEMINI_AI",
        "description": "This project demonstrates how to integrate Google Gemini LLM with a MySQL database using LangChain for natural language queries. It uses semantic similarity-based few-shot learning to generate accurate SQL queries and fetch results from the database. The application supports text-to-SQL conversion and dynamic prompting for enhanced query generation.",
        "technologies": ["Python", "LangChain", "Google Gemini", "MySQL", "Chroma"]
    },
    {
        "title": "SpeedTest_with_Flask",
        "url": "https://github1s.com/mtptisid/SpeedTest_with_Flask",
        "description": "A speed test application built using Flask for the backend, with HTML, CSS, and JavaScript handling the frontend. The application allows users to test their internet speed, displaying results on a visually appealing speedometer dashboard. It includes functionalities for both download and upload speed tests, with real-time updates and a responsive design.",
        "technologies": ["Python", "Flask", "HTML", "CSS", "JavaScript"]
    },
    {
        "title": "Stock-Price-Prediction-using-LLMs",
        "url": "https://github1s.com/mtptisid/Stock-Price-Prediction-using-LLMs",
        "description": "An AI-powered finance agent that leverages large language models (LLMs) to analyze stock market trends, predict future prices, and provide insights into stocks. It integrates data from various sources, including Yahoo Finance for stock data and NewsAPI for stock news articles. The agent uses this data to make predictions and assist in financial decision-making.",
        "technologies": ["Python", "LLMs", "yfinance", "NewsAPI", "Backtesting"]
    },
    {
        "title": "StockSense-AI",
        "url": "https://github1s.com/mtptisid/StockSense-AI",
        "description": "StockSense AI is a powerful, AI-driven platform designed to provide in-depth stock market analysis and options trading insights. Built with Streamlit, Plotly, and yfinance, this application allows users to analyze stock performance, view interactive charts, and explore options trading data. The integration of AI agents enhances the platform's ability to deliver financial insights and web-based research.",
        "technologies": ["Python", "Streamlit", "Plotly", "yfinance", "AI Agents"]
    },
    {
        "title": "STUDENT STUDY HELPER_AI WITH GOOGLE GEMINI",
        "url": "https://github1s.com/mtptisid/STUDENT_STUDY_HELPER_AI_WITH_GOOGLE_GEMINI",
        "description": "An AI-powered study assistant that utilizes Google's Gemini LLM to help students with their studies. The application can answer questions, provide explanations, and assist with various academic tasks, enhancing the learning experience through intelligent interactions.",
        "technologies": ["Python", "Google Gemini", "LangChain", "Streamlit"]
    },
    {
        "title": "SysAdmin-GPT_Small_1.0_300M",
        "url": "https://github1s.com/mtptisid/SysAdmin-GPT_Small_1.0_300M",
        "description": "SysAdmin-GPT is a lightweight language model fine-tuned for system administration tasks. With 300 million parameters, it is designed to assist with common sysadmin queries, providing quick and accurate responses to technical questions related to system management.",
        "technologies": ["Python", "GPT", "System Administration", "Machine Learning"]
    },
    {
        "title": "Systemd-related",
        "url": "https://github1s.com/mtptisid/Systemd-related",
        "description": "A collection of resources and scripts related to systemd, the system and service manager for Linux operating systems. This repository includes unit files, service configurations, and examples to help manage and troubleshoot systemd services effectively.",
        "technologies": ["Linux", "Systemd", "Shell Scripting"]
    },
    {
        "title": "Vehicle-Security-System-with-Aurdino",
        "url": "https://github1s.com/mtptisid/Vehicle-Security-System-with-Aurdino",
        "description": "An Arduino-based vehicle security system designed to enhance the safety of vehicles. The system includes features such as motion detection, alarm triggers, and RFID-based access control, providing a comprehensive security solution for automobiles.",
        "technologies": ["Arduino", "RFID", "Sensors", "Embedded Systems"]
    },
    {
        "title": "Workout-and-fitness-tracker-Model",
        "url": "https://github1s.com/mtptisid/Workout-and-fitness-tracker-Model",
        "description": "This repository features a machine learning model designed to analyze workout efficiency based on various health metrics. Utilizing a dataset of over 10,000 records, the model identifies patterns in fitness progress and provides personalized insights. The application is deployed using Streamlit, offering an interactive UI for real-time analysis. Users can input their workout data to receive feedback and suggestions for improvement.",
        "technologies": ["Python", "Machine Learning", "Streamlit", "Pandas", "Scikit-learn"]
    },
    {
        "title": "Youtube Video Transcribe Summarizer with whisper OPENAI App",
        "url": "https://github1s.com/mtptisid/Youtube_Video_Transcribe_Summarizer_with_whisper_OPENAI_App",
        "description": "This application allows users to summarize YouTube videos by transcribing and processing their audio. Built with state-of-the-art technologies like LangChain, Google Gemini, OpenAI Whisper, and Streamlit, it provides a seamless experience to extract meaningful insights from video content. Users can input a YouTube URL, and the app transcribes the audio, summarizes the content, and enables question-answering based on the summarized text.",
        "technologies": ["Python", "OpenAI Whisper", "LangChain", "Google Gemini", "Streamlit"]
    }
];

const ProjectsViewPage = () => {
  const [shuffledProjects] = useState(() => {
    const shuffled = [...projects].sort(() => Math.random() - 0.5);
    return shuffled;
  });
  const [selectedProject, setSelectedProject] = useState(null);

  const handleExploreClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  const styles = {
    navbar: {
      position: 'fixed',
      width: '100vw',
      height: '60px',
      backgroundColor: '#404347',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 0.75rem',
      top: 0,
      zIndex: 101,
      boxSizing: 'border-box'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#2d3748',
      color: '#edf2f7',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
      fontSize: '1rem',
      fontWeight: '600',
      height: '45px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      transform: 'scale(1)'
    },
    mobileNavLink: {
      color: '#edf2f7',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      backgroundColor: '#404347'
    },
    backNavLink: {
      color: '#edf2f7',
      backgroundColor: '#404347',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem'
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'Inter, sans-serif' }}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .projects-section {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 80px;
            background-color: #f7fafc;
            zIndex: 100;
            width: 100vw;
            height: calc(100vh - 60px - 80px);
            overflow: hidden;
            opacity: 1;
            will-change: opacity;
            transition: opacity 0.5s ease;
          }
          .slider {
            display: flex;
            height: 100%;
            width: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          .slider > div {
            flex: 0 0 100%;
            scroll-snap-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 100vw;
            height: 100%;
            padding: 1rem;
          }
          .slider::-webkit-scrollbar {
            display: none;
          }
          .slider {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .project-card {
            background: linear-gradient(145deg, #ffffff, #e6e6e6);
            border: none;
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 1.5rem;
            width: calc(100% - 2rem);
            height: calc(100% - 2rem);
            max-width: 500px;
            text-align: center;
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .project-card:hover {
            transform: scale(1.03);
          }
          .project-details {
            flex-grow: 1;
            overflow-y: auto;
            padding-bottom: 1rem;
          }
          .project-details h3 {
            font-size: 1.25rem;
            fontWeight: 700;
            color: #000000;
            margin-bottom: 0.75rem;
            transition: color 0.2s ease;
          }
          .project-details h3:hover {
            color: #2563eb;
          }
          .project-details p {
            font-size: 0.75rem;
            color: #000000;
            margin-bottom: 1rem;
            line-height: 1.4;
          }
          .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .tech-stack img {
            height: 1.25rem;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
          .button-container {
            margin-top: auto;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .button-container button {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            height: 40px;
            background-color: #1f2937;
            border-color: #d1d5db;
          }
          .button-container button:hover {
            background-color: #374151;
            transform: scale(1.05);
          }
          .footer {
            background-color: #1f2937;
            color: #ffffff;
            padding: 0.1rem 0;
            width: 100vw;
            position: fixed;
            bottom: 0;
            zIndex: 101;
            text-align: center;
          }
          .preview-container {
            position: absolute;
            top: 60px;
            left: 0;
            width: 100vw;
            height: calc(100vh - 60px);
            background-color: #f7fafc;
            zIndex: 100;
          }
          .preview-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          @media (max-width: 480px) {
            .navbar {
              padding: 0.5rem;
            }
            .project-card {
              padding: 1rem;
              width: calc(100% - 1.5rem);
              height: calc(100% - 1.5rem);
            }
            .project-details h3 {
              font-size: 1rem;
            }
            .project-details p {
              font-size: 0.625rem;
            }
            .tech-stack img {
              height: 1rem;
            }
            .button-container button {
              font-size: 0.75rem;
              padding: 0.4rem 0.8rem;
              height: 36px;
            }
            .footer {
              padding: 1rem 0;
              font-size: 0.875rem;
            }
            .preview-container {
              top: 60px;
              width: 100vw;
              height: calc(100vh - 60px);
            }
            .preview-iframe {
              width: 100%;
              height: 100%;
            }
            .projects-section {
              display: ${selectedProject ? 'none' : 'block'};
            }
            .footer {
              display: ${selectedProject ? 'none' : 'block'};
            }
          }
        `}
      </style>
      <nav style={styles.navbar}>
        <div className="mobile-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {selectedProject ? (
            <button
              style={styles.backNavLink}
              onClick={handleBackClick}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Back to Projects"
            >
              <FiArrowLeft size={24} />
            </button>
          ) : (
            <a
              href="/"
              style={styles.mobileNavLink}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Home"
            >
              <FiHome size={24} />
            </a>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href="/contact"
              style={styles.mobileNavLink}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Contact"
            >
              <FiMail size={24} />
            </a>
            <a
              href="https://mtptisid.github.io"
              style={styles.mobileNavLink}
              onMouseEnter={(e) => e.target.style.color = '#63b3ed'}
              onMouseLeave={(e) => e.target.style.color = '#edf2f7'}
              aria-label="Profile"
            >
              <FaUser size={24} />
            </a>
          </div>
        </div>
      </nav>
      {selectedProject ? (
        <div className="preview-container">
          <iframe
            src={selectedProject.url}
            className="preview-iframe"
            title={`${selectedProject.title} Code Preview`}
            allow="clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      ) : (
        <>
          <section className="projects-section">
            <div className="slider">
              {shuffledProjects.map((project, index) => (
                <div key={index}>
                  <div className="project-card animate-fadeIn" style={{ animationDelay: `${0.2 * index}s` }}>
                    <div className="project-details">
                      <h3>Project {index + 1}: {project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <div className="tech-stack">
                      {project.technologies.map((tech, idx) => (
                        techBadges[tech] && (
                          <img
                            key={idx}
                            src={techBadges[tech]}
                            alt={`${tech} badge`}
                          />
                        )
                      ))}
                    </div>
                    <div className="button-container">
                      <button
                        style={styles.actionButton}
                        onClick={() => handleExploreClick(project)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#4a5568';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#2d3748';
                          e.target.style.transform = 'scale(1)';
                        }}
                        aria-label="Explore Code"
                      >
                        <FiCode style={{ marginRight: '0.5rem' }} size={18} color="#edf2f7" />
                        Explore Code
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <footer className="footer">
            <div style={{ maxWidth: '896px', margin: '0 auto' }}>
              <p style={{ fontSize: '0.2rem', fontWeight: '300' }}>
                © 2025 Siddharamayya M. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default ProjectsViewPage;
