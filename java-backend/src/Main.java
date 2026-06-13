import model.LottoDraw;
import analysis.LottoAnalyzer;

public class Main {
    public static void main(String[] args) {
        if (args.length < 7) {
            System.err.println("{\"error\": \"Fehlende Argumente. Erwartet werden 6 Hauptzahlen und 1 Zusatzzahl.\"}");
            System.exit(1);
        }

        try {
            int[] haupt = new int[6];
            for (int i = 0; i < 6; i++) {
                haupt[i] = Integer.parseInt(args[i]);
            }
            int zz = Integer.parseInt(args[6]);

            LottoDraw draw = new LottoDraw(haupt, zz);
            LottoAnalyzer.AnalysisResult result = LottoAnalyzer.analyze(draw);

            // Output als valider JSON-String für Node.js
            String jsonOutput = String.format(java.util.Locale.US,
                    "{\"even\": %d, \"odd\": %d, \"totalSum\": %d, \"average\": %.2f, \"rangeMin\": %d, \"rangeMax\": %d}",
                    result.even, result.odd, result.totalSum, result.average, result.rangeMin, result.rangeMax);

            System.out.println(jsonOutput);

        } catch (NumberFormatException e) {
            System.out.println("{\"error\": \"Zahlenformat ungueltig. Bitte nur Ganzzahlen uebergeben.\"}");
            System.exit(1);
        } catch (IllegalArgumentException e) {
            System.out.println(String.format("{\"error\": \"%s\"}", e.getMessage()));
            System.exit(1);
        }
    }
}