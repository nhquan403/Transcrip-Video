package common;

/** Chạy một phần của demo --live; phần nào còn TODO hoặc lỗi thì báo rồi chạy tiếp phần sau. */
public final class LiveSection {
    private LiveSection() {}

    public static void run(String title, Runnable body) {
        System.out.println("\n▶ " + title);
        try {
            body.run();
        } catch (UnsupportedOperationException e) {
            System.out.println("  ⏳ chưa làm: " + e.getMessage());
        } catch (RuntimeException e) {
            System.out.println("  ❌ " + e);
            for (Throwable cause = e.getCause(); cause != null; cause = cause.getCause()) {
                System.out.println("     do: " + cause);
            }
        }
    }
}
