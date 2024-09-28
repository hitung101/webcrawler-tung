// utils/CreateSlug.js

function createSlug(title) {
    return title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w\-]+/g, '') // Loại bỏ các ký tự không phải là chữ cái, chữ số hoặc dấu gạch ngang
      .replace(/\-\-+/g, '-') // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
      .replace(/^-+/, '') // Loại bỏ dấu gạch ngang ở đầu
      .replace(/-+$/, ''); // Loại bỏ dấu gạch ngang ở cuối
  }
  
  module.exports = { createSlug };
  