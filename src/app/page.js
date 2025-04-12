import Image from "next/image";
// import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import Stroke from "@/components/Stroke/Stroke";
import Stats from "@/components/Stats/Stats";
import Advantages from "@/components/Advantages/Advantages";
import Contacts from "@/components/Contacts/Contacts";
import Footer from "@/components/Footer/Footer";
export default function Home() {
  return (
    <div>
      <div className="hero-background">
        <Header />
        <Stroke />
        <Stats />
      </div>

      <Advantages />
      <Contacts />
      <Footer />
    </div>
  );
}
