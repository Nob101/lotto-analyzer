
package analysis;

import model.LottoDraw;
import java.util.Arrays;

public class LottoAnalyzer {

    public static AnalysisResult analyze(LottoDraw draw) {
        int evenCount = 0;
        int oddCount = 0;
        int sum = 0;

        for (int num : draw.getMainNumbers()) {
            sum += num;
            if (num % 2 == 0) {
                evenCount++;
            } else {
                oddCount++;
            }
        }

        double average = (double) sum / draw.getMainNumbers().length;
        int min = Arrays.stream(draw.getMainNumbers()).min().orElse(1);
        int max = Arrays.stream(draw.getMainNumbers()).max().orElse(45);

        return new AnalysisResult(evenCount, oddCount, sum, average, min, max);
    }

    public static class AnalysisResult {
        public final int even;
        public final int odd;
        public final int totalSum;
        public final double average;
        public final int rangeMin;
        public final int rangeMax;

        public AnalysisResult(int even, int odd, int totalSum, double average, int rangeMin, int rangeMax) {
            this.even = even;
            this.odd = odd;
            this.totalSum = totalSum;
            this.average = average;
            this.rangeMin = rangeMin;
            this.rangeMax = rangeMax;
        }
    }
}