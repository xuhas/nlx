using System.Collections;
using System.Collections.Generic;
using UnityEngine;
//using Quobject.SocketIoClientDotNet.Client;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;

//namespace PolyPaint.Server
namespace KartGame.KartSystems
{
    public enum Direction
    {
        STRAIGHT,
        LEFT,
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

    public struct SpeechResponse
    {
        public SpeechCommand command;
    }

    public struct MovementResponse
    {
        public Direction dir;
        public float intensity;
    }

    /* 
        This is a singleton because the connection must be established only once.
    */
    //public sealed class ExternalSource
    //{
    //    private static readonly Lazy<ExternalSource>
    //        lazy = new Lazy<ExternalSource>(() => new ExternalSource());
    //    public static ExternalSource Instance { get { return lazy.Value; } }
    //    private static readonly string SocketURL = "http://localhost:3000/";
    //    private Socket socket;
    //    private bool isConnected = false;

    //    private ExternalSource()
    //    {
    //        socket = IO.Socket(SocketURL);
    //        Connect();
    //        OnReceiveMessage();
    //        OnDisconnect();
    //    }

    //    private void Connect()
    //    {
    //        socket.On(Socket.EVENT_CONNECT, () =>
    //        {
    //            isConnected = true;
    //            Console.WriteLine("Socket connected.");
    //        });
    //    }

    //    public void OnDisconnect()
    //    {
    //        socket.On(Socket.EVENT_DISCONNECT, () =>
    //        {
    //            isConnected = false;
    //            Console.WriteLine("Socket disconnected.");
    //        });
    //    }

    //    public void Disconnect()
    //    {
    //        Emit(Socket.EVENT_DISCONNECT, new { });
    //        isConnected = false;
    //        Console.WriteLine("Disconnected the user from the socket");
    //    }

    //    private void Emit(string eventName, object content)
    //    {
    //        var arr = new object[] { JsonConvert.SerializeObject(content) };
    //        socket.Emit(eventName, arr);
    //    }

    //    public delegate void ReceivedMovementEventHandler(MovementResponse response);
    //    public event ReceivedMovementEventHandler movementEvent;

    //    public delegate void ReceivedSpeechEventHandler(SpeechResponse response);
    //    public event ReceivedSpeechEventHandler speechEvent;

    //    public void OnReceiveMessage()
    //    {
    //        socket.On("hands-event", data =>
    //        {
    //            Console.WriteLine("hands-event");
    //            if (isConnected) movementEvent(((JArray)data).ToObject<MovementResponse>());
    //        });

    //        socket.On("speech-event", data =>
    //        {
    //            Console.WriteLine("speech-event");
    //            if (isConnected) speechEvent(((JArray)data).ToObject<SpeechResponse>());
    //        });
    //    }

    
}
