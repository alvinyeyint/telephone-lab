import { initLinkus } from "@src/utils/linkus-sdk";
import { GetYeastarSignature } from "@src/utils/yeastar-handshake";
import { useCallSessionStore } from "@src/utils/zustand";
import { useCallback, useState } from "react";
import type { PBXOperator, PhoneOperator, Session } from "ys-webrtc-sdk-core";
import { Button } from "./Base/Button";
import { Card } from "./Base/Card";
import { Input } from "./Base/Input";
import { Title } from "./Base/Title";
import { CallInProgress, DialPad, IncomingCall } from "./Telephone";
import { IconLoader2, IconPlayerPlay, IconPlayerStop, IconRefresh } from '@tabler/icons-react'

export function CallSetupUI() {
  const [username, setUsername] = useState("1000000");
  const [AccessID, setAccessId] = useState("pff9hrKNCMEPZmoZxLVEBBdcZygoC68p");
  const [AccessKey, setAccessKey] = useState("9K01COaFlXmjEJQomPZm1oKSIdO34zR7");
  const [apiUrl, setApiUrl] = useState("https://grandag.ras.yeastar.com");

  const [isGettingSignature, setIsGettingSignature] = useState(false);
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState("");

  const { phone, setPhone, sessions, setSessions } = useCallSessionStore();

  const [pbx, setPBX] = useState<PBXOperator>();
  const [destroy, setDestroy] = useState<() => void>(() => () => {});

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>("");
  const [incomings, setIncoming] = useState<Session[]>([]);
  const [cause, setCause] = useState<string>("");

  const getSignature = useCallback(() => {
    setIsGettingSignature(true);
    const signature = new GetYeastarSignature({
      AccessID,
      AccessKey,
      apiUrl,
      username,
    });
    signature
      .handshake()
      .then(({ data, errcode, errmsg }) => {
        if (errmsg === "FAILURE") {
          setSignatureError(errcode + ": Failed to load signature.");
        } else {
          setSignature(data.sign);
          setSignatureError("");
        }
      })
      .catch((err) => {
        setSignatureError("Throw on handshake.");
        throw new Error(err);
      })
      .finally(() => setIsGettingSignature(false));
  }, [AccessID, AccessKey, apiUrl, username]);

  const setupEventListener = useCallback(
    (phone: PhoneOperator) => {
      const startSession = ({
        callId,
        session,
      }: {
        callId: any;
        session: any;
      }) => {
        setCallId(callId);
        setSessions(Array.from(phone.sessions.values()));
      };

      const deleteSession = ({
        callId,
        cause,
      }: {
        callId: any;
        cause: any;
      }) => {
        // here can handle session deleted event.
        setCause(cause);

        setSessions(Array.from(phone.sessions.values()));
      };
      const incoming = ({ callId, session }: { callId: any; session: any }) => {
        // This example disabled call waiting, only handle one call.
        // So here just handle one incoming call.
        setIncoming([session]);
      };
      const connected = () => {
        setIsConnecting(false);
        setIsConnected(true);
      };
      const disconnected = () => {
        setIsConnecting(false);
        setIsConnected(false);
      };
      phone.on("startSession", startSession);
      phone.on("deleteSession", deleteSession);
      phone.on("incoming", incoming);
      phone.on("connected", connected);
      phone.on("disconnected", disconnected);
    },
    [setSessions]
  );

  const startLinkus = useCallback(() => {
    initLinkus(
      { pbxURL: apiUrl, secret: signature, username },
      {
        beforeStart(phone) {
          setupEventListener(phone);
        },
        afterStart(phone, pbx) {
          setPhone(phone);
          setPBX(pbx);
        },
      }
    );
  }, [apiUrl, setPhone, setupEventListener, signature, username]);

  const copySignatureToClipboard = useCallback(() => {
    if (signature.length > 0) navigator.clipboard.writeText(signature);
  }, [signature]);

  return (
    <div>
      <section className="mb-8 grid grid-cols-2 gap-8 border-b-2 border-slate-400 pb-8">
        <div className="flex flex-col items-stretch gap-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <Input
            label="AccessID"
            value={AccessID}
            onChange={(e) => setAccessId(e.currentTarget.value)}
          />
          <Input
            label="AccessKey"
            value={AccessKey}
            onChange={(e) => setAccessKey(e.currentTarget.value)}
          />
          <Input
            label="Api Url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.currentTarget.value)}
          />

          <Button
            onClick={getSignature}
            className="gap-4"
            disabled={isGettingSignature}
          >
            {isGettingSignature && <IconRefresh className="animate-spin" />} Get
            signature
          </Button>
        </div>

        <Card className="mx-auto flex w-full flex-col gap-2">
          {isConnected ? (
            <p>Linkus is connected.</p>
          ) : (
            <>
              <Input
                label="Signature"
                value={signature}
                onChange={(e) => setSignature(e.currentTarget.value)}
              />
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </>
          )}

          <div className="flex justify-end gap-4">
            {isConnected ? (
              <></>
              // <Button
              //   className="bg-red-500 hover:bg-red-600"
              //   onClick={(e) => {
              //     e.preventDefault();
              //     destroy?.();
              //   }}
              // >
              //   Stop Linkus <IconPlayerStop />
              // </Button>
            ) : (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={username === "" || signature === ""}
                onClick={() => {
                  setIsConnecting(true);
                  startLinkus();
                }}
              >
                {isConnecting ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  <span className="flex">
                    Start Linkus <IconPlayerPlay />
                  </span>
                )}
              </Button>
            )}
          </div>
        </Card>
      </section>
      <section className="grid grid-cols-2 gap-4">
        {isConnected && <DialPad onCall={(number) => phone?.call(number)} />}

        <div className="flex flex-col gap-4">
          {sessions.length > 0 && <CallInProgress />}
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          {incomings.map((session) => (
            <>
              <Title size="md">Incoming Calls</Title>
              <IncomingCall
                key={session.status.callId}
                session={session}
                handler={() => setIncoming([])}
              />
            </>
          ))}
        </div>
      </section>
    </div>
  );
}
