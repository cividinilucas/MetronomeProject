import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
    const [bpm, setBpm] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [volume, setVolume] = useState(50); // Volume inicial em 50%
    const audio = useRef(new Audio('src/assets/sound2.mp3'));
    const intervalRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const playSound = () => {
            audio.current.currentTime = 0; // Reinicia o áudio
            audio.current.play().catch(error => {
                console.error("Erro ao tentar reproduzir o áudio:", error); // Depuração
            });
        };

        if (isPlaying) {
            console.log("Iniciando metrônomo..."); // Depuração
            const interval = (60 / bpm) * 1000; // Calcula o intervalo em milissegundos
            intervalRef.current = setInterval(playSound, interval);

            // Inicia o temporizador para contar o tempo decorrido
            timerRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000); // Atualiza o contador a cada segundo
        } else {
            console.log("Parando metrônomo...");
            clearInterval(intervalRef.current);
            clearInterval(timerRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(timerRef.current);
        };
    }, [isPlaying, bpm]);

    useEffect(() => {
        // Atualiza o volume do áudio sempre que o volume do estado mudar
        audio.current.volume = volume / 100; // Converte o volume para uma escala de 0 a 1
    }, [volume]);

    const handleBpmChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setBpm(value);
        }
    };

    const handleVolumeChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setVolume(value);
        }
    };

    const togglePlay = () => {
        setIsPlaying(prevState => {
            if (!prevState) {
                setElapsedTime(0); // Reseta o tempo quando começar a tocar novamente
            }
            return !prevState;
        });
    };

    return (
        <section className="main">
            <h1>Metronomo</h1>
            <div>
                <p>{elapsedTime} segundos</p>
            </div>
            <input
                type="number"
                value={bpm}
                onChange={handleBpmChange}
                placeholder="BPM"
                min="1"
            />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}>
                {isPlaying ? 'Parar' : 'Iniciar'}
            </motion.button>
            <div className='range'>
                <label htmlFor="volume">Volume: {volume}</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
        </section>
    );
};

export default Home;
