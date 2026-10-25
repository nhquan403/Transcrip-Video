package lesson02;

import java.util.List;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/** Lời giải mẫu bài 02. Hãy tự làm {@link Lesson02} trước khi xem. */
public class Lesson02Solution implements Lesson02Api {

    @Override
    public long totalInputTokens(int promptTokens, List<Integer> toolOutputTokens) {
        long context = promptTokens;
        long total = context;
        for (int output : toolOutputTokens) {
            context += output;
            total += context;
        }
        return total;
    }

    @Override
    public double chanceAllStepsCorrect(double stepAccuracy, int steps) {
        return Math.pow(stepAccuracy, steps);
    }

    @Override
    public int maxStepsForTarget(double stepAccuracy, double target) {
        int steps = 0;
        while (steps < 10_000 && Math.pow(stepAccuracy, steps + 1) >= target) {
            steps++;
        }
        return steps;
    }

    @Override
    public long waitTimeMs(List<Long> roundTripsMs) {
        return roundTripsMs.stream().mapToLong(Long::longValue).sum();
    }

    @Override
    public String hybridPipeline(String input, Predicate<String> validate, UnaryOperator<String> agentStage,
                                 UnaryOperator<String> format) {
        if (!validate.test(input)) {
            throw new IllegalArgumentException("Invalid input: " + input);
        }
        String result;
        try {
            result = agentStage.apply(input);
        } catch (RuntimeException e) {
            return "ERROR: " + e.getMessage();
        }
        return format.apply(result);
    }
}
