﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace KartGame.KartSystems
{
    /// <summary>
    /// Speech and wrnch input.
    /// </summary>
    public class KeyboardInput : MonoBehaviour, IInput
    {
        public float MaxSpeed
        {
            get { return m_MaxSpeed; }
        }
        public float Acceleration
        {
            get { return m_Acceleration; }
        }
        public float Steering
        {
            get { return m_Steering; }
        }
        public bool BoostPressed
        {
            get { return m_BoostPressed; }
        }
        public bool FirePressed
        {
            get { return m_FirePressed; }
        }
        public bool HopPressed
        {
            get { return m_HopPressed; }
        }
        public bool HopHeld
        {
            get { return m_HopHeld; }
        }

        public bool leftEnabled
        {
            get { return m_leftEnabled; }
        }
        public bool rightEnabled
        {
            get { return m_rightEnabled; }
        }
        public float maxSpeed 
        {
            get { return m_MaxSpeed; }
        }


        bool m_leftEnabled = false;
        bool m_rightEnabled = false;

        float m_MaxSpeed;
        float m_Acceleration;
        float m_Steering;
        bool m_HopPressed;
        bool m_HopHeld;
        bool m_BoostPressed;
        bool m_FirePressed;

        // TODO : remove when socket enabled
        private void turnRight(float intensity = 1)
        {
            m_Steering = 100f;
            //m_rightEnabled = true;
            //m_leftEnabled = false;
        }

        // TODO : remove when socket enabled
        private void turnLeft(float intensity = 1)
        {
            m_Steering = -100f;
            //m_leftEnabled = true;
            //m_rightEnabled = false;
        }

        private void goStraight()
        {
            m_Steering = 0f;
            //m_leftEnabled = false;
            //m_rightEnabled = false;
        }

       public void processMovement(MovementResponse response)
        {
            Debug.Log("PROCESS" + response.direction);
            switch (response.direction)
            {
                case "Left":
                    Debug.Log("left");
                    turnLeft(response.intensity);
                    break;
                case "Right":
                    Debug.Log("right");
                    turnRight(response.intensity);
                    break;
                case "Straight":
                    goStraight();
                    break;
            }
        }

        private void processSpeech(SpeechResponse response)
        {
            switch (response.command)
            {

                case SpeechCommand.LEFT:
                    Debug.Log("left");
                    turnLeft();
                    break;
                case SpeechCommand.RIGHT:
                    Debug.Log("right");
                    turnRight();
                    break;
                case SpeechCommand.FASTER:
                    Debug.Log("faster");
                    if (m_MaxSpeed < 25.0f)
                        m_MaxSpeed += 5.0f;
                    break;
                case SpeechCommand.SLOWER:
                    Debug.Log("slower");
                    if (m_MaxSpeed > 5.0f)
                        m_MaxSpeed = m_MaxSpeed - 5.0f;
                    break;
                case SpeechCommand.START:
                    m_Acceleration = 1.0f;
                    break;
                case SpeechCommand.STOP:
                    m_Acceleration = 0.0f;
                    break;
                default:
                    goStraight();
                    break;
            }
        }

        private void Update()
        {
            if (ExternalSource.Instance.GetSpeech() != null)
                processSpeech(ExternalSource.Instance.GetSpeech());

            if (ExternalSource.Instance.GetMovement() != null)
                processMovement(ExternalSource.Instance.GetMovement());
        }
    }
}
