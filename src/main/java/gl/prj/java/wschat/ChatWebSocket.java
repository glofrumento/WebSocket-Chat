package gl.prj.java.wschat;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author giovanni
 */
@ServerEndpoint(value = "/wschat")
public class ChatWebSocket {

  // private static final int MEMBER_ID = 0;
	// private String membri = new String();
	// IN Messages codes
	private static final int JOIN_MEMBER_MSG_CODE = 1;
	private static final int BROADCAST_MSG_CODE = 2;
	// OUT Messages codes
	private static final int MEMBERSLIST_MSG_CODE = 3;
	private static final int MESSAGE_MSG_CODE = 4;
	private static final Set<Session> PEERS = Collections.synchronizedSet(new HashSet<Session>());
	private static final HashMap<String, String> CHAT_MEMBERS = new HashMap<>();

	public ChatWebSocket() {
	}

	@OnMessage
	public void onMessage(String data, Session peer) {
		System.out.println("Ricevuto messaggio: " + data);
		Msg msg = convertiJson2Java(data);

		// System.out.println("onMessage " + data);
		if (msg.getHeader().getId() == JOIN_MEMBER_MSG_CODE) {
			CHAT_MEMBERS.put(peer.getId(), msg.getBody().getPeer());
			updateMembers();
		}
		if (msg.getHeader().getId() == BROADCAST_MSG_CODE) {
			String messaggio;
			for (Session p : PEERS) {
				try {
					// messaggio = "{'header':{'id':" + messageMsgCode + "}, 'body':{'data':'" +
					// msg.getBody().getData() + "'}}";
					// {'header':{'id':4}, 'body':{'data':'ggg: !!!!!'}}
					messaggio = "{'header':{'id':'" + MESSAGE_MSG_CODE + "'}, 'body':{'peer':'"
							+ msg.getBody().getPeer() + "','msg':'" + msg.getBody().getMsg() + "','data':'"
							+ msg.getBody().getData() + "'}}";
					// {'header':{'id':'4'},'body':{'peer':'GIO','msg':'Ciao','data':''}}
					p.getBasicRemote().sendText(messaggio);
				} catch (IOException ex) {
					Logger.getLogger(ChatWebSocket.class.getName()).log(Level.SEVERE, null, ex);
				}
			}
		}
	}

	@OnOpen
	public void onOpen(Session peer) {
		PEERS.add(peer);
		System.out.println("Ricevuta richiesta apertura socket: " + peer.toString());
	}

	@OnClose
	public void onClose(Session peer) {
		System.out.println("onClose");
		PEERS.remove(peer);
		CHAT_MEMBERS.remove(peer.getId());
		updateMembers();
	}

	private Msg convertiJson2Java(String data) {

		System.out.println("\nStringa Json: " + data);
		// String json = "{'header':{'id': 1}, 'body':{'data':'Giovanni'}}";
		Gson gson = new Gson();

		// converte JSON in un oggetto java
		Msg msg = gson.fromJson(data, Msg.class);
		System.out.println("Oggetto Java: " + msg);
		return msg;
	}

	private void updateMembers() {

		Collection<String> members;
		// members = new ArrayList<>();

		members = CHAT_MEMBERS.values();
		String membri = "{'header':{'id':" + MEMBERSLIST_MSG_CODE + "}, 'body':{'data':'";
		for (String s : members) {
			membri = membri.concat("<li>" + s + "</li>");
		}
		membri = membri + "'}}";
		System.out.println("membri " + membri);

		for (Session peer : PEERS) {
			try {
				peer.getBasicRemote().sendText(membri);
			} catch (IOException ex) {
				Logger.getLogger(ChatWebSocket.class.getName()).log(Level.SEVERE, null, ex);
			}
		}
	}

	@OnError
	public void onError(Throwable t) {
		System.out.println("onError function");
	}

  /*
   * private void HashMap() { throw new
   * UnsupportedOperationException("Not supported yet."); }
   */

}
