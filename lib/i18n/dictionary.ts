import type { Locale } from "./config";

type Dictionary = {
  nav: {
    home: string;
    about: string;
    conference: string;
    membership: string;
    contact: string;
    documents: string;
    news: string;
    archive: string;
  };
  actions: {
    conferenceDetails: string;
    learnMore: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    title: string;
    body: string;
    updating: string;
  };
  conference: {
    title: string;
    name: string;
    dates: string;
    location: string;
    summary: string;
    note: string;
    stats: {
      days: string;
      halls: string;
      sessions: string;
      presentations: string;
    };
  };
  contact: {
    title: string;
    address: string;
    phone: string;
    mobile: string;
    email: string;
  };
  footer: {
    about: string;
    conference: string;
    resources: string;
    contact: string;
    rights: string;
    privacy: string;
    terms: string;
    translationNotice: string;
  };
};

const vi: Dictionary = {
  nav: {
    home: "Trang chủ",
    about: "Giới thiệu",
    conference: "Hội nghị",
    membership: "Hội viên",
    contact: "Liên hệ",
    documents: "Tài liệu",
    news: "Tin tức",
    archive: "Hội nghị các năm",
  },
  actions: {
    conferenceDetails: "Thông tin hội nghị",
    learnMore: "Tìm hiểu thêm",
    contact: "Liên hệ",
  },
  hero: {
    eyebrow: "Hội Ghép tạng Việt Nam",
    title: "Kết nối tri thức, nâng tầm ghép tạng Việt Nam",
    subtitle: "Vietnam Society of Organ Transplantation",
    description:
      "Diễn đàn học thuật của các chuyên gia ghép tạng Việt Nam: chia sẻ kinh nghiệm, cập nhật tiến bộ y học và kết nối cộng đồng chuyên ngành.",
  },
  about: {
    title: "Giới thiệu Hội",
    body: "Hội Ghép tạng Việt Nam (VSOT) là tổ chức xã hội nghề nghiệp của những người làm công tác ghép tạng tại Việt Nam.",
    updating: "Nội dung giới thiệu đang được cập nhật.",
  },
  conference: {
    title: "Hội nghị khoa học thường niên",
    name: "Hội nghị khoa học thường niên lần XI — VSOT 2026",
    dates: "13–17 tháng 10 năm 2026",
    location: "TP. Đà Nẵng",
    summary:
      "Chương trình khoa học gồm các phiên toàn thể, phiên song song, báo cáo và poster trong 5 ngày.",
    note: "Chương trình khoa học chi tiết đang được số hoá và sẽ công bố trên website.",
    stats: {
      days: "ngày",
      halls: "hội trường",
      sessions: "phiên",
      presentations: "báo cáo",
    },
  },
  contact: {
    title: "Liên hệ",
    address: "201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh",
    phone: "Điện thoại",
    mobile: "Di động",
    email: "Email",
  },
  footer: {
    about: "Về VSOT",
    conference: "Hội nghị",
    resources: "Tài nguyên",
    contact: "Liên hệ",
    rights: "Hội Ghép tạng Việt Nam. Bảo lưu mọi quyền.",
    privacy: "Chính sách bảo mật",
    terms: "Miễn trừ trách nhiệm",
    translationNotice: "English translation is being updated.",
  },
};

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    conference: "Congress",
    membership: "Membership",
    contact: "Contact",
    documents: "Documents",
    news: "News",
    archive: "Previous Conferences",
  },
  actions: {
    conferenceDetails: "Congress information",
    learnMore: "Learn more",
    contact: "Contact us",
  },
  hero: {
    eyebrow: "Vietnam Society of Organ Transplantation",
    title: "Connecting knowledge, advancing organ transplantation in Vietnam",
    subtitle: "Hội Ghép tạng Việt Nam",
    description:
      "An academic forum for Vietnamese transplant professionals to share experience, update medical advances and connect the specialty community.",
  },
  about: {
    title: "About VSOT",
    body: "The Vietnam Society of Organ Transplantation (VSOT) is the professional society for organ transplantation practitioners in Vietnam.",
    updating: "English translation is being updated.",
  },
  conference: {
    title: "Annual Scientific Congress",
    name: "11th Annual Scientific Congress — VSOT 2026",
    dates: "13–17 October 2026",
    location: "Da Nang City, Vietnam",
    summary:
      "A five-day scientific programme with plenary sessions, concurrent sessions, oral presentations and posters.",
    note: "The detailed scientific programme is being digitised and will be published on this website.",
    stats: {
      days: "days",
      halls: "halls",
      sessions: "sessions",
      presentations: "presentations",
    },
  },
  contact: {
    title: "Contact",
    address: "201B Nguyen Chi Thanh, District 5, Ho Chi Minh City",
    phone: "Phone",
    mobile: "Mobile",
    email: "Email",
  },
  footer: {
    about: "About VSOT",
    conference: "Congress",
    resources: "Resources",
    contact: "Contact",
    rights: "Vietnam Society of Organ Transplantation. All rights reserved.",
    privacy: "Privacy policy",
    terms: "Disclaimer",
    translationNotice: "English translation is being updated.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
