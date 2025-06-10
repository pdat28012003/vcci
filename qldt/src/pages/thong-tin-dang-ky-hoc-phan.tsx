import React from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import RegistrationInfo from "../components/RegistrationInfo";

const RegistrationInfoPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Thông tin đăng ký học phần - Hệ thống quản lý đào tạo</title>
        <meta
          name="description"
          content="Thông tin chi tiết về quy trình và kế hoạch đăng ký học phần"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
      </Head>

      <Layout>
        <RegistrationInfo />
      </Layout>
    </>
  );
};

export default RegistrationInfoPage;