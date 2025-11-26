"use client";

export async function fetchData(
  token: string | null,
  endpoint: string
): Promise<unknown> {
  const res = await fetch(`${backendurl}/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export const backendurl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const KERALA_COLLEGES = [
  "Indian Institute of Technology Palakkad (IIT Palakkad)",
  "National Institute of Technology Calicut (NIT Calicut)",
  "Indian Institute of Management Kozhikode (IIM Kozhikode)",
  "Cochin University of Science and Technology (CUSAT)",
  "University of Kerala",
  "Mahatma Gandhi University, Kottayam",
  "Kannur University",
  "Calicut University",
  "Kerala University of Digital Sciences, Innovation and Technology",
  "Amrita Vishwa Vidyapeetham, Amritapuri Campus",
  "College of Engineering Trivandrum (CET)",
  "Government Engineering College Thrissur",
  "Rajagiri School of Engineering and Technology",
  "Toc H Institute of Science and Technology",
  "Mar Baselios College of Engineering and Technology",
  "Sree Chitra Thirunal College of Engineering",
  "Model Engineering College, Ernakulam",
  "TKM College of Engineering, Kollam",
  "LBS Institute of Technology for Women",
  "NSS College of Engineering, Palakkad",
  "Government Engineering College Barton Hill",
  "Malabar College of Engineering and Technology",
  "Ilahia College of Engineering and Technology",
  "Federal Institute of Science and Technology (FISAT)",
  "Albertian Institute of Science and Technology",
  "RAJIV GANDHI INSTITUTE OF TECHNOLOGY, KOTTAYAM",
  "Saintgits College of Engineering (Autonomous), Kottayam",
  "TOMS College of Engineering And Polytechnic",
  "St. Joseph's College of Engineering and Technology, Palai (Autonomous)",
  "Mangalam College of Engineering",
  "Amal Jyothi College of Engineering Autonomous",
  "College of Engineering Kidangoor",
  "GIT Engineering College - Kangazha Kottayam",
];
