using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using UnityEngine.Networking;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace KartGame.KartSystems
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Direction
    {
        [EnumMember(Value = "Straight")]
        STRAIGHT,
        [EnumMember(Value = "Left")]
        LEFT,
        [EnumMember(Value = "Right")]
        RIGHT
    }

    public enum SpeechCommand
    {
        STRAIGHT,
        LEFT,
        RIGHT,
        FASTER,
        SLOWER,
        START,
        STOP
    }

    public class SpeechResponse
    {
        public SpeechCommand command;
    }

    public class MovementResponse
    {
        public string direction;
        public float intensity;
    }

    /* 
        This is a singleton because the connection must be established only once.
    */
    public sealed class ExternalSource: MonoBehaviour
    {
        private static readonly Lazy<ExternalSource>
            lazy = new Lazy<ExternalSource>(() => new ExternalSource());
        public static ExternalSource Instance { get { return lazy.Value; } }

        private static MovementResponse movementReponse;
        private static SpeechResponse speechResponse;

        public MovementResponse GetMovement()
        {
            return movementReponse;
        }

        public SpeechResponse GetSpeech()
        {
            return speechResponse;
        }

        private void Awake ()
        {
            InvokeRepeating("GetMovement2", 2.0f, 0.2f);
            InvokeRepeating("GetSpeech2", 2.0f, 0.2f);
        }

        private void GetMovement2()
        {
            StartCoroutine(GetMvtRequest("http://localhost:3002/videoInput"));
        }

        private void GetSpeech2()
        {
            StartCoroutine(GetSpeechRequest("http://localhost:3003/textInput"));
        }

        IEnumerator GetMvtRequest(string uri)
        {
            using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
            {
                // Request and wait for the desired page.
                yield return webRequest.SendWebRequest();

                string[] pages = uri.Split('/');
                int page = pages.Length - 1;

                if (webRequest.isNetworkError)
                {
                    //Debug.Log(pages[page] + ": Error: " + webRequest.error);
                }
                else
                {
                    Debug.Log("RESP #1: " + webRequest.downloadHandler.text);
                    var reponse = JsonConvert.DeserializeObject<MovementResponse>(webRequest.downloadHandler.text);
                    movementReponse = reponse;
                }
            }
        }
        IEnumerator GetSpeechRequest(string uri)
        {
            using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
            {
                // Request and wait for the desired page.
                yield return webRequest.SendWebRequest();

                string[] pages = uri.Split('/');
                int page = pages.Length - 1;

                if (webRequest.isNetworkError || webRequest.responseCode == 500)
                {
                    //Debug.Log(pages[page] + ": Error: " + webRequest.error);
                }
                else
                {
                    Debug.Log("RESP #2: " + webRequest.downloadHandler.text);
                    speechResponse = new SpeechResponse() {
                        command = (SpeechCommand) Enum.Parse(typeof(SpeechCommand), webRequest.downloadHandler.text)
                    };
                }
            }
        }


    }

    
}
