import CubeSvg from "../assets/introduction/block.svg?react";
import ChipSvg from "../assets/introduction/chip.svg?react";
import CodeSvg from "../assets/introduction/code.svg?react";
import image from "../assets/introduction/cyprian.jpg";
import LightbulbSvg from "../assets/introduction/lightbulb.svg?react";
import MusicSvg from "../assets/introduction/music.svg?react";
import TerminalSvg from "../assets/introduction/terminal.svg?react";
import "./IntroductionImage.css";

function Card({ Svg, top, bottom, left, right }) {
  return (
    <div className="images-card" style={{ top, bottom, left, right }}>
      <Svg style={{ width: "100%", height: "100%", fill: "#fff9" }} />
    </div>
  )
}

export default function IntroductionImage() {
  return (
    <div className="images">
      <img src={image} alt="Cyprian Moj photo" className="main-picture" />
      <Card Svg={TerminalSvg} top={"-15%"} left={"-25%"}></Card>
      <Card Svg={LightbulbSvg} top={"-10%"} right={"-22%"}></Card>
      <Card Svg={MusicSvg} bottom={"35%"} right={"-33%"}></Card>
      <Card Svg={CubeSvg} bottom={"-9%"} right={"-20%"}></Card>
      <Card Svg={CodeSvg} bottom={"-12%"} left={"-17%"}></Card>
      <Card Svg={ChipSvg} top={"32%"} left={"-35%"}></Card>
    </div>
  );
}

