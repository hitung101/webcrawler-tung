const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { createSlug } = require('./utils/CreateSlug'); // Import hàm tạo slug

const baseURL = 'https://123job.vn/nganh-nghe/vi%E1%BB%87c-l%C3%A0m-it-ph%E1%BA%A7n-m%E1%BB%81m?cat=IT+ph%E1%BA%A7n+m%E1%BB%81m&sort=new&cat_name=IT+ph%E1%BA%A7n+m%E1%BB%81m&page=';
let globalIndex = 1;

// Hàm lấy dữ liệu từ một trang
async function fetchPage(page) {
  const { data } = await axios.get(baseURL + page);
  return cheerio.load(data);
}

// Hàm crawl các job từ một trang
async function crawlJobsFromPage(page) {
  const $ = await fetchPage(page);
  const jobs = [];

  $('.job__list-item').each((index, element) => {
    const title = $(element).find('.job__list-item-title').text().trim();
    const company = $(element).find('.job__list-item-company').text().trim();
    const location = $(element).find('.address').text().trim();
    const salary = $(element).find('.salary').text().trim();
    const description = `<div class="job-description">${$(element).find('.job__list-item-teaser').html().trim()}</div>`;
    const relativeUrl = $(element).find('.job__list-item-title a').attr('href');
    const url = `${relativeUrl}`; // Cập nhật URL

    const number = salary.match(/\d+/g) || [];
    let unit = '';
    let lower_bound = 0;
    let upper_bound = 0;

    const regexUSD = /\b(usd)\b/i;
    const regexVND = /\b(triệu)\b/i;
    const regexUpperBound = /^(tới)/;
    const regexLowerBound = /^(trên)/;

    if (salary.match(regexUSD)) {
      unit = 'USD';
    } else if (salary.match(regexVND)) {
      unit = 'triệu vnd';
    }

    if (salary.match(regexUpperBound)) {
      upper_bound = number[0] || 0;
    } else if (salary.match(regexLowerBound)) {
      lower_bound = number[0] || 0;
    } else if (number.length > 1) {
      lower_bound = number[0];
      upper_bound = number[1];
    }

    const expiration_date = '2024-12-31'; // Placeholder for expiration date
    const job_type = 'Full-time'; // Placeholder for job type
    const created_at = new Date().toISOString().split('T')[0]; // Chỉ lấy ngày, không cần giờ
    const slug = createSlug(title);
    const uniqueSlug = `${slug}-${Date.now()}`; // Thêm timestamp vào slug để đảm bảo tính duy nhất

    jobs.push({
      title,
      description,
      location,
      experience: "Chưa xác định", // Placeholder
      requirement: "Chưa xác định", // Placeholder
      salary,
      expiration_date,
      job_type,
      created_at,
      url,
      company,
    });
  });

  return jobs;
}

// Hàm lưu công việc vào tệp JSON
function saveJobToFile(job) {
  const dir = 'C:/Users/Tung/Desktop/Chuyển đổi số/tim-viec-main/Crawler/Crawler/Jobs';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const filePath = path.join(dir, `${createSlug(job.title)}-${Date.now()}.json`); // Thêm timestamp vào tên tệp
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2));
  console.log(`Saved: ${filePath}`);
}

// Crawl dữ liệu từ nhiều trang
async function crawlAllJobs() {
  try {
    const totalPages = 6; // Số lượng trang cần crawl
    let allJobs = [];
    let recordNumber = 1;
    for (let page = 3; page <= totalPages; page++) {
      console.log(`Crawling page ${page}...`);
      const jobs = await crawlJobsFromPage(page);
      allJobs = allJobs.concat(jobs);
      jobs.forEach(job => {
        console.log(`STT ${recordNumber}:`);
        console.log(JSON.stringify(job, null, 2));
        saveJobToFile(job);
        console.log('');
        recordNumber++;
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Bắt đầu crawl dữ liệu
crawlAllJobs();
