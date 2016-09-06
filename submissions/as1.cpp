#include <iostream>
#include <cstdlib> 
#include <ctime>
#include <vector>

using namespace std;

bool check(int a, int n) {
	return a >= 0 && a < n;
}

int limitRand(int limit){
	int r, d = RAND_MAX / limit;
	limit *= d;
	do {
		r = rand();
	} while (r >= limit);
	return r / d;
}

int main() {
	srand(time(NULL));
	int player;
	cin >> player;

	int state[6][6];

	for (int i = 0; i < 6; i++) {
		for (int j = 0; j < 6; j++) {
			cin >> state[i][j];
		}
	}

	int x1, y1, x2, y2;
	cin >> x1 >> y1 >> x2 >> y2;

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

	vector<pair<int, int> > vec;
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

			vec.push_back(make_pair(i, j));
		}
	}

	int index = limitRand(vec.size());
	cout << vec[index].first << " " << vec[index].second << endl;
}
