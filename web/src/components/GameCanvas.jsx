import React, {useEffect,useRef} from "react";
import { GAME_COFING } from "../constants/gameConfig";


export default function GameCanvas({
    gameStarted,
    setGameStarted,
    setGameOver,
    setScore,
    setTimeLeft,
    playerXRef,
    playerDepthRef,
    bulletsRef,
    triggerShootRef,
}) {
    const canvasRef = useRef(null)
    const gameLoopRef = useRef(null)
    const enimiesRef = useRef([]);
    const scoreRef = useRef(0)
}
