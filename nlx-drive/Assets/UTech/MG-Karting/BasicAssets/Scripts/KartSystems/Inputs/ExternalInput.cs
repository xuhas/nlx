using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace KartGame.KartSystems
{
    /// <summary>
    /// Speech and wrnch input.
    /// </summary>
    public class ExternalInput
    {
        public bool leftEnabled
        {
            get { return m_leftEnabled; }
        }
        public bool rightEnabled
        {
            get { return m_rightEnabled; }
        }
               
        bool m_leftEnabled = false;
        bool m_rightEnabled = false;

        // TODO : remove when socket enabled
        public void turnRight()
        {
            m_rightEnabled = true;
            m_leftEnabled = false;
        }

        // TODO : remove when socket enabled
        public void turnLeft()
        {
            m_leftEnabled = true;
            m_rightEnabled = false;
        }

        public void goStraight()
        {
            m_leftEnabled = false;
            m_rightEnabled = false;
        }
    }
}
