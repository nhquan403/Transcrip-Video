package part1.lesson08;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.function.Consumer;

/** Lời giải mẫu bài 08. Hãy tự làm {@link Lesson08} trước khi xem. */
public class Lesson08Solution implements Lesson08Api {

    @Override
    public InputMode chooseMode(Workload w) {
        if (w.needsImages() || w.needsInterrupt() || w.interactive() || w.multiTurn()) return InputMode.STREAMING;
        if (w.statelessOneOff()) return InputMode.SINGLE_MESSAGE;
        return InputMode.STREAMING;
    }

    @Override
    public String singleMessage(String prompt, Model model) {
        return model.reply(List.of(new Turn("user", prompt)));
    }

    @Override
    public List<String> streamingSession(Iterator<String> inputs, Model model) {
        List<Turn> conversation = new ArrayList<>();
        List<String> replies = new ArrayList<>();
        while (inputs.hasNext()) {
            conversation.add(new Turn("user", inputs.next()));
            String reply = model.reply(List.copyOf(conversation));
            conversation.add(new Turn("assistant", reply));
            replies.add(reply);
        }
        return replies;
    }

    @Override
    public String resume(List<Turn> priorTranscript, String prompt, Model model) {
        List<Turn> conversation = new ArrayList<>(priorTranscript);
        conversation.add(new Turn("user", prompt));
        return model.reply(conversation);
    }

    @Override
    public String streamOutput(Iterator<String> deltas, Consumer<String> onDelta) {
        StringBuilder full = new StringBuilder();
        while (deltas.hasNext()) {
            String delta = deltas.next();
            onDelta.accept(delta);
            full.append(delta);
        }
        return full.toString();
    }
}
