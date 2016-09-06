import java.util.Random;
import java.util.ArrayList;
import java.util.Scanner;

class Main {

	Random r = new Random();

	boolean check(int a, int n) {
		return a >= 0 && a < n;
	}

	void start() {
		Scanner in = new Scanner(System.in);
		int player = in.nextInt();
		
		int state[][] = new int[6][6];

		for (int i = 0; i < 6; i++) {
			for (int j = 0; j < 6; j++) {
				state[i][j] = in.nextInt();
			}
		}

		int x1 = in.nextInt();
		int y1 = in.nextInt();
		int x2 = in.nextInt();
		int y2 = in.nextInt();

		int x, y, xx, yy;
		if (player == 1) {
			x = x1;
			y = y1;

			xx = x2;
			yy = y2;
		} else {
			x = x2;
			y = y2;

			xx = x1;
			yy = y1;
		}

		ArrayList<Pair> vec = new ArrayList<>();
		for (int i = x - 1; i <= x + 1; i++) {
			for (int j = y - 1; j <= y + 1; j++) {
				if (i == x && j == y) {
					continue;
				}
			
				if (!check(i, 6) || !check(j, 6)) {
					continue;
				}

				if (state[i][j] <= -3) {
					continue;
				}

				if (i == xx && j == yy) {
					continue;
				}

				vec.add(new Pair(i, j));
			}
		}

		int index = r.nextInt(vec.size());
		System.out.println(vec.get(index).getKey() + " " + vec.get(index).getValue());
	}

	public static void main(String args[]) {
		new Main().start();
	}

	class Pair {
		int key, value;

		public Pair(int k, int v) {
			key = k;
			value = v;
		}

		public int getKey() {
			return key;
		}
		public int getValue() {
			return value;
		}
	}
}

