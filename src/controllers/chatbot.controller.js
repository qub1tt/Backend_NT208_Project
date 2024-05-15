const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyDWC5eQtCKMF52dV-ifl73zTPOSqCF-FGQ");

exports.chatBot = async (req, res) => {
  const generationConfig = {
    maxOutputTokens: 1400,
    temperature: 0.8,
    topP: 0.8,
    topK: 8,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    safetySettings,
    generationConfig,
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `
                You are now a chat bot of a books selling website. Your job is to assist customer to buy books that I've provided the data for you.
                `,
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },

      {
        role: "user",
        parts: [
          {
            text: `
        "$release_date": "2024-04-14T00:00:00Z",
        "view_counts": 778,
        "category": "Tâm lý",
        "sales": 0,
        "author": "Eric Barker",
        "nsx": "Tổng hợp thành phố Hồ Chí Minh",
        "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580438/books/tamly/cho-sua-nham-cay_hy0qq8.png",
        "name": "Chó sủa nhầm cây",
        "price": 127400`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Chó sủa nhầm cây",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-17T00:00:00Z"
              },
              "view_counts": 1144,
              "sales": 0,
              "category": "Tâm lý",
              "name": "Tâm lý Học Nhân Cách",
              "price": 132300,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580436/books/tamly/nhancach_j1tqyy.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Thomas Erikson"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Tâm lý Học Nhân Cách",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-01T00:00:00Z"
              },
              "view_counts": 551,
              "sales": 0,
              "category": "Tâm lý",
              "name": "Hồ Sơ Tâm Lý Học Tâm Thần Hay Kẻ Điên",
              "price": 138000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580435/books/tamly/tamthan_nj7cfp.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Mục Qua"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Hồ Sơ Tâm Lý Học Tâm Thần Hay Kẻ Điên",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-02T00:00:00Z"
              },
              "view_counts": 421,
              "sales": 0,
              "category": "Tâm lý",
              "name": "Thao Túng Tâm Lý - Nhận Diện, Thức Tỉnh Và Chữa Lành Những Tổn Thương Tiềm Ẩn",
              "price": 113000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580433/books/tamly/thaotung_kyrtev.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Shannon Thomas"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Thao Túng Tâm Lý - Nhận Diện, Thức Tỉnh Và Chữa Lành Những Tổn Thương Tiềm Ẩn",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-03T00:00:00Z"
              },
              "view_counts": 382,
              "sales": 0,
              "category": "Tâm lý",
              "name": "Tâm Lý Học Về Tiền",
              "price": 112000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580434/books/tamly/tien_vxqajs.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Morgan Housel"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Tâm Lý Học Về Tiền",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-03-17T00:00:00Z"
              },
              "view_counts": 398,
              "sales": 0,
              "category": "Văn học",
              "name": "Danh Tác Văn Học Việt Nam - Chí Phèo (Tái bản 2023)",
              "price": 81000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580455/books/vanhoc/chipheo_lvz5l5.png",
              "nsx": "Trẻ",
              "author": "Nam Cao"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Chí Phèo",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-03-02T00:00:00Z"
              },
              "view_counts": 382,
              "sales": 0,
              "category": "Văn học",
              "name": "Có Hai Con Mèo Ngồi Bên Cửa Sổ",
              "price": 71000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580449/books/vanhoc/conmeo_h8214w.png",
              "nsx": "Trẻ",
              "author": "Nguyễn Nhật Ánh"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Có Hai Con Mèo Ngồi Bên Cửa Sổ",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-12T00:00:00Z"
              },
              "view_counts": 333,
              "sales": 0,
              "category": "Văn học",
              "name": "Làm Đĩ",
              "price": 71500,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580450/books/vanhoc/lamdi_pcgbgd.png",
              "nsx": "Trẻ",
              "author": "Vũ Trọng Phụng"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Làm Đĩ",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-03-10T00:00:00Z"
              },
              "view_counts": 370,
              "sales": 0,
              "category": "Văn học",
              "name": "Mắt Biếc",
              "price": 109000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580452/books/vanhoc/matbiec_pzxakj.png",
              "nsx": "Trẻ",
              "author": "Nguyễn Nhật Ánh"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Mắt Biếc",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-09T00:00:00Z"
              },
              "view_counts": 402,
              "sales": 0,
              "category": "Văn học",
              "name": "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
              "price": 141350,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580454/books/vanhoc/tuithay_lsqaat.png",
              "nsx": "Trẻ",
              "author": "Nguyễn Nhật Ánh"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-03-15T00:00:00Z"
              },
              "view_counts": 393,
              "sales": 0,
              "category": "Truyện tranh",
              "name": "Dragon Ball Super - Tập 15: Moro - Kẻ Ăn Hành Tinh",
              "price": 21500,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580442/books/truyen/dragon-ball-1_jf03vt.png",
              "nsx": "Kim Đồng",
              "author": "Akira Toriyama"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Dragon Ball Super - Tập 15: Moro - Kẻ Ăn Hành Tinh",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-08T00:00:00Z"
              },
              "view_counts": 415,
              "sales": 0,
              "category": "Truyện tranh",
              "name": "Dragon Ball Super - Tập 16: Chiến Binh Mạnh Nhất Vũ Trụ",
              "price": 21500,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580444/books/truyen/dragon-ball-2_tpvcbs.png",
              "nsx": "Kim Đồng",
              "author": "Akira Toriyama"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Dragon Ball Super - Tập 16: Chiến Binh Mạnh Nhất Vũ Trụ",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-03-12T00:00:00Z"
              },
              "view_counts": 371,
              "sales": 0,
              "category": "Truyện tranh",
              "name": "Naruto Tập 70: Naruto & Lục Đạo Tiên Nhân",
              "price": 21500,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580445/books/truyen/naruto_tdq3fd.png",
              "nsx": "Kim Đồng",
              "author": "Masashi Kishimoto"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Naruto Tập 70: Naruto & Lục Đạo Tiên Nhân",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-11T00:00:00Z"
              },
              "view_counts": 349,
              "sales": 0,
              "category": "Truyện tranh",
              "name": "Doraemon Tập 1: Chú Khủng Long Của Nobita",
              "price": 22000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580441/books/truyen/dora_tivq8k.png",
              "nsx": "Kim Đồng",
              "author": "Fujiko F Fujio"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Doraemon Tập 1: Chú Khủng Long Của Nobita",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-20T00:00:00Z"
              },
              "describe": "Nhân vật chính của Bleach là Ichigo Kurosaki có khả năng nhìn thấy những hồn ma. Cuộc sống của cậu thay đổi khi cậu gặp Rukia Kuchiki, một Thần Chết và là thành viên của Âm Giới. Khi chiến đấu với một yêu quái chuyên đi săn những người có năng lực tâm linh, Rukia đã cho Ichigo mượn sức mạnh của mình để cậu có thể cứu gia đình mình. Nhưng trước sự ngạc nhiên của Rukia, Ichigo đã hấp thu toàn bộ sức mạnh của cô. Khi đã trở thành một Thần Chết, Ichigo nhanh chóng biết được rằng thế giới cậu đang sống chứa đầy những linh hồn nguy hiểm, và cùng với Rukia, người đang từ từ khôi phục lại sức mạnh của mình, công việc của Ichigo lúc này là bảo vệ những người vô tội khỏi lũ yêu quái và giúp đỡ những linh hồn tìm được nơi yên nghỉ. Không dừng lại tại đó, trong Bleach, Ichigo sẽ dần phải đụng độ với các tổ chức hùng mạnh, với những âm mưu đan xen để bảo vệ thế giới.",
              "view_counts": 415,
              "sales": 0,
              "category": "Truyện tranh",
              "name": "Bleach Special",
              "price": 16000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580440/books/truyen/bleach5_feaaz7.png",
              "nsx": "Kim Đồng",
              "author": "Kubo"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Bleach Special",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-21T00:00:00Z"
              },
              "view_counts": 454,
              "sales": 0,
              "category": "Kinh tế",
              "name": "Tư Duy Chiến Lược - Lý Thuyết Trò Chơi Thực Hành",
              "price": 111600,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580409/books/kinhte/chienluoc_ls2hiw.png",
              "nsx": "Trẻ",
              "author": "Avinash K. Dixit"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Tư Duy Chiến Lược - Lý Thuyết Trò Chơi Thực Hành",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-15T00:00:00Z"
              },
              "view_counts": 372,
              "sales": 0,
              "category": "Kinh tế",
              "name": "Nghĩ Giàu & Làm Giàu",
              "price": 77000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580411/books/kinhte/giau_swi7fq.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Napoleon Hill"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Nghĩ Giàu & Làm Giàu",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-18T00:00:00Z"
              },
              "view_counts": 353,
              "sales": 0,
              "category": "Kinh tế",
              "name": "Kinh Tế Học - Khái Lược Những Tư Tưởng Lớn",
              "price": 319000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580411/books/kinhte/Kinh-te-1_vtudgc.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "DK"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Kinh Tế Học - Khái Lược Những Tư Tưởng Lớn",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-09T00:00:00Z"
              },
              "view_counts": 400,
              "sales": 0,
              "category": "Kinh tế",
              "name": "Phù Thủy Sàn Chứng Khoán",
              "price": 135400,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580409/books/kinhte/phu-thuy-san-chung-khoan_wre6dr.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Jack. D. Schwager"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Phù Thủy Sàn Chứng Khoán",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-18T00:00:00Z"
              },
              "view_counts": 400,
              "sales": 0,
              "category": "Kinh tế",
              "name": "KINH TẾ VĨ MÔ",
              "price": 244800,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580410/books/kinhte/vimo_ra2hhf.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "NGregory Mankiw"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách KINH TẾ VĨ MÔ",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": "2024-04-30T00:00:00Z",
            "view_counts": 383,
            "sales": 0,
            "category": "SGK",
            "name": "Sách Giải Tích Lớp 12",
            "price": 10000,
            "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580427/books/sgk/giaitich_jt6hty.png",
            "nsx": "Bộ Giáo Dục Việt Nam",
            "author": "Nhiều tác giả"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Sách Giải Tích Lớp 12",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 370,
              "sales": 0,
              "category": "SGK",
              "name": "Sách Tin Học Lớp 12",
              "price": 10000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580429/books/sgk/tin_u8kktj.png",
              "nsx": "Bộ Giáo Dục Việt Nam",
              "author": "Nhiều tác giả"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Sách Tin Học Lớp 12",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 351,
              "sales": 0,
              "category": "SGK",
              "name": "Sách Hóa Lớp 12",
              "price": 10000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580430/books/sgk/hoa_fvibkp.png",
              "nsx": "Bộ Giáo Dục Việt Nam",
              "author": "Nhiều tác giả"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Sách Hóa Lớp 12",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 353,
              "sales": 0,
              "category": "SGK",
              "name": "Sách Vật Lý Lớp 12",
              "price": 10000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580425/books/sgk/ly_bvwfhg.png",
              "nsx": "Bộ Giáo Dục Việt Nam",
              "author": "Nhiều tác giả"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Sách Vật Lý Lớp 12",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 368,
              "sales": 0,
              "id_category": "SGK",
              "name": "Sách Ngữ Văn Lớp 12",
              "price": 10000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714580426/books/sgk/nguvan_njluw7.png",
              "id_nsx": "Bộ Giáo Dục Việt Nam",
              "id_author": "Nhiều tác giả"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Sách Ngữ Văn Lớp 12",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 332,
              "sales": 0,
              "category": "Khoa học",
              "name": "Introduction to Algorithms 4th edition",
              "price": 500000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714579745/books/khoahoc/algorithm_cthutx.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Thomas H. Cormen"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Introduction to Algorithms 4th edition",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 363,
              "sales": 0,
              "category": "Khoa học",
              "name": "The C++ Programming Language, 4th Edition",
              "price": 600000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1715421497/books/khoahoc/nibg9jg1ge3pnxyysqle.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Bjarne Stroustrup"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách The C++ Programming Language, 4th Edition",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 352,
              "sales": 0,
              "category": "Khoa học",
              "name": "Computer Systems: A Programmer's Perspective",
              "price": 550000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714579741/books/khoahoc/cs_lcbnto.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Randal E. Bryant"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Computer Systems: A Programmer's Perspective",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 380,
              "sales": 0,
              "category": "Khoa học",
              "name": "Hands-On Machine Learning with Scikit-Learn and TensorFlow: Concepts, Tools, and Techniques to Build Intelligent Systems",
              "price": 500000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714579750/books/khoahoc/ml_z17hi2.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Aurélien Géron"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Hands-On Machine Learning with Scikit-Learn and TensorFlow: Concepts, Tools, and Techniques to Build Intelligent Systems",
          },
        ],
      },

      {
        role: "user",
        parts: [
          {
            text: `
            "release_date": {
                "$date": "2024-04-30T00:00:00Z"
              },
              "view_counts": 377,
              "sales": 0,
              "category": "Khoa học",
              "name": "Khoa Học Khám Phá - Mật Mã - Từ Cổ Điển Đến Lượng Tử",
              "price": 145000,
              "img": "https://res.cloudinary.com/dbfgeiwuc/image/upload/v1714579829/books/khoahoc/matma_h3wlt0.png",
              "nsx": "Tổng hợp thành phố Hồ Chí Minh",
              "author": "Simon Singh"`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Tôi đã nhận được dữ liệu về cuốn sách Khoa Học Khám Phá - Mật Mã - Từ Cổ Điển Đến Lượng Tử",
          },
        ],
      },
    ],
  });

  const userMessage = req.body.message;

  try {
    const botResponse = await chat.sendMessageStream(userMessage);
    const response = await botResponse.response;
    const text = await response.text();
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
