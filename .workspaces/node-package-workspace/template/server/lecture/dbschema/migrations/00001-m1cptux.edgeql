CREATE MIGRATION m1cptuxrebaebvvvus7e6utng4omlhs6dxfmtuigqxg237biqd5wya
    ONTO initial
{
  CREATE SCALAR TYPE default::CourseStatus EXTENDING enum<draft, published, archived>;
  CREATE SCALAR TYPE default::EnrollmentStatus EXTENDING enum<pending, active, completed, canceled, refunded>;
  CREATE SCALAR TYPE default::LectureStatus EXTENDING enum<draft, published, locked>;
  CREATE SCALAR TYPE default::UserRole EXTENDING enum<student, instructor, admin>;
  CREATE FUTURE no_linkful_computed_splats;
  CREATE TYPE default::Coupon {
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY discount_percent: std::int16 {
          CREATE CONSTRAINT std::max_value(100);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY is_active: std::bool;
  };
  CREATE TYPE default::Category {
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY role: default::UserRole;
  };
  CREATE TYPE default::Course {
      CREATE REQUIRED LINK category: default::Category;
      CREATE REQUIRED LINK instructor: default::User;
      CREATE REQUIRED PROPERTY detail: std::str;
      CREATE REQUIRED PROPERTY intro: std::str;
      CREATE REQUIRED PROPERTY price: std::int64;
      CREATE REQUIRED PROPERTY slug: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY status: default::CourseStatus;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::Cart {
      CREATE OPTIONAL LINK coupon: default::Coupon;
      CREATE MULTI LINK courses: default::Course;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Certification {
      CREATE REQUIRED LINK course: default::Course;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY verify_url: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Enrollment {
      CREATE REQUIRED LINK course: default::Course;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY status: default::EnrollmentStatus;
  };
  CREATE TYPE default::Lecture {
      CREATE REQUIRED LINK course: default::Course;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY duration_sec: std::int64;
      CREATE REQUIRED PROPERTY sort_order: std::int16;
      CREATE REQUIRED PROPERTY status: default::LectureStatus;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::Review {
      CREATE REQUIRED LINK course: default::Course;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY rating: std::int16 {
          CREATE CONSTRAINT std::max_value(5);
          CREATE CONSTRAINT std::min_value(1);
      };
  };
  CREATE TYPE default::Progress {
      CREATE REQUIRED LINK enrollment: default::Enrollment;
      CREATE REQUIRED LINK lecture: default::Lecture;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY percent: std::int16 {
          CREATE CONSTRAINT std::max_value(100);
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  CREATE TYPE default::Notification {
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY message: std::str;
  };
};
