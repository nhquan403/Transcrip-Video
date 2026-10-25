package common;

import java.util.Objects;

/** Minimal test harness for the lesson exercises: prints one line per check and a summary. */
public final class Checker {
    private int passed;
    private int failed;

    public interface Body {
        void run() throws Exception;
    }

    public void check(String name, Body body) {
        try {
            body.run();
            passed++;
            System.out.println("  ✅ " + name);
        } catch (UnsupportedOperationException e) {
            failed++;
            System.out.println("  ⏳ " + name + " -> chưa làm: " + e.getMessage());
        } catch (Throwable e) {
            failed++;
            System.out.println("  ❌ " + name + " -> " + e);
        }
    }

    public static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new AssertionError("mong đợi <" + expected + "> nhưng nhận <" + actual + ">");
        }
    }

    public static void assertTrue(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    /** Runs body and returns the exception it throws, failing if none (or only a TODO) is thrown. */
    public static <T extends Throwable> T expectThrows(Class<T> type, Body body) throws Exception {
        try {
            body.run();
        } catch (UnsupportedOperationException e) {
            throw e;
        } catch (Throwable e) {
            if (type.isInstance(e)) return type.cast(e);
            throw new AssertionError("mong đợi " + type.getSimpleName() + " nhưng nhận " + e);
        }
        throw new AssertionError("mong đợi " + type.getSimpleName() + " nhưng không có exception nào");
    }

    /** Prints the summary and returns true when every check passed. */
    public boolean summary() {
        System.out.println("  Kết quả: " + passed + "/" + (passed + failed) + " đạt");
        return failed == 0;
    }
}
