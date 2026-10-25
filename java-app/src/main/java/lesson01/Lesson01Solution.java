package lesson01;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import java.util.concurrent.Executors;

/** Lời giải mẫu bài 01. Hãy tự làm {@link Lesson01} trước khi xem. */
public class Lesson01Solution implements Lesson01Api {

    @Override
    public Design chooseDesign(TaskProfile task) {
        int signals = (task.openEnded() ? 1 : 0) + (task.unknownSteps() ? 1 : 0) + (task.modelChoosesTools() ? 1 : 0);
        return signals >= 2 ? Design.AGENT : Design.WORKFLOW;
    }

    @Override
    public String promptChain(String input, List<UnaryOperator<String>> steps, Predicate<String> gate) {
        String output = input;
        for (int i = 0; i < steps.size(); i++) {
            output = steps.get(i).apply(output);
            if (!gate.test(output)) {
                throw new IllegalStateException("Gate failed after step " + (i + 1) + ": " + output);
            }
        }
        return output;
    }

    @Override
    public String route(String request, Function<String, String> classifier,
                        Map<String, UnaryOperator<String>> handlers, UnaryOperator<String> fallback) {
        String label = classifier.apply(request);
        return handlers.getOrDefault(label, fallback).apply(request);
    }

    @Override
    public List<String> parallelize(List<String> sections, UnaryOperator<String> worker) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> futures = new ArrayList<>();
            for (String section : sections) {
                futures.add(executor.submit(() -> worker.apply(section)));
            }
            List<String> results = new ArrayList<>();
            for (Future<String> f : futures) {
                results.add(f.get());
            }
            return results;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        } catch (ExecutionException e) {
            throw new IllegalStateException(e.getCause());
        }
    }

    @Override
    public String runAgent(String goal, Model model, Map<String, UnaryOperator<String>> tools, int maxSteps) {
        List<Step> history = new ArrayList<>();
        while (true) {
            Action action = model.next(goal, List.copyOf(history));
            switch (action) {
                case Finish finish -> {
                    return finish.answer();
                }
                case CallTool call -> {
                    if (history.size() >= maxSteps) {
                        throw new IllegalStateException("Agent did not finish within " + maxSteps + " steps");
                    }
                    UnaryOperator<String> tool = tools.get(call.tool());
                    String observation = tool == null ? "error: unknown tool " + call.tool() : tool.apply(call.input());
                    history.add(new Step(call, observation));
                }
            }
        }
    }
}
