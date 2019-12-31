package gl.prj.java.wschat;

public class Msg {

  private Header header;
  private Body body;

  static class Header {

    private int id;

    int getId() {
      return id;
    }

    void setId(int id) {
      this.id = id;
    }
  }

  static class Body {

    private String peer;
    private String msg;
    private String data;

    public String getPeer() {
      return peer;
    }

    public void setPeer(String peer) {
      this.peer = peer;
    }

    public String getMsg() {
      return msg;
    }

    public void setMsg(String msg) {
      this.msg = msg;
    }

    String getData() {
      return data;
    }

    void setData(String data) {
      this.data = data;
    }
  }

  Header getHeader() {
    return header;
  }

  void setHeader(Header header) {
    this.header = header;
  }

  Body getBody() {
    return body;
  }

  void setBody(Body body) {
    this.body = body;
  }

  @Override
  public String toString() {
    return "Msg [Header [Id=" + header.getId() + "], Body [peer=" + body.getPeer() + " msg=" +body.getMsg()+ " data=" + body.getData() + "]]";
  }
}
