# include <iostream>
using namespace std;
int main(){
    int a = 20 ,b = 40, c= 10;
    (a>b&& a>c)? cout <<a: (b>c && b>a)? cout<<b: cout<<c;
}